'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuCategory, MenuItem } from '@/lib/types';
import CategoryManager from './CategoryManager';
import MenuItemForm from './MenuItemForm';
import MenuItemList from './MenuItemList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface MenuTabProps {
  password: string;
}

export default function MenuTab({ password }: MenuTabProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'items' | 'categories'>('items');
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const authHeaders = { 'Authorization': `Bearer ${password}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, itemRes] = await Promise.all([
        fetch('/api/admin/categories', { headers: authHeaders }),
        fetch('/api/admin/menu-items', { headers: authHeaders }),
      ]);

      if (catRes.ok) setCategories(await catRes.json());
      if (itemRes.ok) setMenuItems(await itemRes.json());
    } catch (err) {
      console.error('Failed to fetch menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleFormSave = () => {
    setShowItemForm(false);
    setEditingItem(null);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowItemForm(false);
    setEditingItem(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading menu data..." />;
  }

  return (
    <div>
      {/* Sub-navigation + action */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-0 border-b border-charcoal/10">
          <button
            onClick={() => setActiveSection('items')}
            className={`relative px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] transition-colors ${
              activeSection === 'items' ? 'text-crimson' : 'text-charcoal/50 hover:text-charcoal/80'
            }`}
          >
            Items ({menuItems.length})
            {activeSection === 'items' && (
              <motion.div
                layoutId="menu-sub-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-crimson"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveSection('categories')}
            className={`relative px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] transition-colors ${
              activeSection === 'categories' ? 'text-crimson' : 'text-charcoal/50 hover:text-charcoal/80'
            }`}
          >
            Categories ({categories.length})
            {activeSection === 'categories' && (
              <motion.div
                layoutId="menu-sub-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-crimson"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </div>

        {activeSection === 'items' && categories.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingItem(null);
              setShowItemForm(true);
            }}
            className="bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] py-2.5 px-5 hover:bg-charcoal transition-all"
          >
            Add Item
          </motion.button>
        )}
      </div>

      {/* Hint if no categories yet */}
      {activeSection === 'items' && categories.length === 0 && (
        <div className="text-center py-8 bg-pearl/90 backdrop-blur-sm p-8 shadow-md">
          <p className="font-sans text-sm text-charcoal/60 mb-3">
            Create at least one category before adding menu items.
          </p>
          <button
            onClick={() => setActiveSection('categories')}
            className="font-sans text-xs uppercase tracking-[0.2em] text-crimson hover:text-charcoal transition-colors"
          >
            Go to Categories
          </button>
        </div>
      )}

      {/* Content */}
      {activeSection === 'items' && categories.length > 0 && (
        <MenuItemList
          password={password}
          items={menuItems}
          categories={categories}
          onEdit={handleEditItem}
          onItemsChange={fetchData}
        />
      )}

      {activeSection === 'categories' && (
        <CategoryManager
          password={password}
          categories={categories}
          onCategoriesChange={fetchData}
        />
      )}

      {/* Item Form Modal */}
      <AnimatePresence>
        {showItemForm && (
          <MenuItemForm
            password={password}
            categories={categories}
            existingItem={editingItem || undefined}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
