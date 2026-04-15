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

-- ============================================
-- Order Management System - Added 2026-04-14
-- ============================================

-- 5. Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Customer Information
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,

  -- Order Details
  delivery_date DATE NOT NULL,
  order_items JSONB NOT NULL, -- Array of {menu_item_id, name, quantity, price}
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  special_instructions TEXT DEFAULT '',

  -- Status Management
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- Valid statuses: 'pending', 'confirmed', 'rejected', 'cancelled'

  -- Confirmation Security
  confirmation_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  confirmed_at TIMESTAMPTZ,
  confirmed_by VARCHAR(50),
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
  CONSTRAINT delivery_date_future CHECK (delivery_date >= CURRENT_DATE)
);

-- Indexes for performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_confirmation_token ON orders(confirmation_token);

-- 6. Create order status history table (audit trail)
CREATE TABLE order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_created_at ON order_status_history(created_at DESC);

-- 7. Auto-update trigger for orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Row Level Security for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Public can create orders
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Public can read orders via confirmation token (filtered in API)
CREATE POLICY "Public read orders" ON orders
  FOR SELECT USING (true);

-- Service role full access (admin operations)
CREATE POLICY "Service role full access orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access order_status_history" ON order_status_history
  FOR ALL USING (true) WITH CHECK (true);
