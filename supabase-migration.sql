-- ============================================
-- Kinchana's Bakery Platform - Database Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Create menu_categories table
CREATE TABLE menu_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_categories_order ON menu_categories(display_order ASC);

-- 2. Create menu_items table
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT DEFAULT '',
  is_available BOOLEAN DEFAULT true,
  dietary_tags TEXT[] DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_order ON menu_items(display_order ASC);

-- 3. Auto-update updated_at on changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_menu_categories_updated_at
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Row Level Security
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Public read access (menu is visible to everyone)
CREATE POLICY "Public read menu_categories" ON menu_categories
  FOR SELECT USING (true);

CREATE POLICY "Public read menu_items" ON menu_items
  FOR SELECT USING (true);

-- Service role full access (admin CRUD via API routes)
CREATE POLICY "Service role full access menu_categories" ON menu_categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access menu_items" ON menu_items
  FOR ALL USING (true) WITH CHECK (true);
