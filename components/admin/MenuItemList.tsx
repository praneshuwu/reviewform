'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { MenuItem, MenuCategory, DietaryTag } from '@/lib/types';
import DietaryBadge from '@/components/ui/DietaryBadge';

interface MenuItemListProps {
  password: string;
  items: MenuItem[];
  categories: MenuCategory[];
  onEdit: (item: MenuItem) => void;
  onItemsChange: () => void;
}

export default function MenuItemList({ password, items, categories, onEdit, onItemsChange }: MenuItemListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/menu-items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${password}` },
      });

      if (!response.ok) throw new Error('Failed to delete');
      setDeleteConfirm(null);
      onItemsChange();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await fetch(`/api/admin/menu-items/${item.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_available: !item.is_available }),
      });
      onItemsChange();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const filteredItems = searchQuery
    ? items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryName(item.category_id).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // Group items by category
  const groupedItems = categories
    .map(cat => ({
      category: cat,
      items: filteredItems.filter(item => item.category_id === cat.id),
    }))
    .filter(group => group.items.length > 0);

  return (
    <div>
      {/* Search */}
      {items.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full px-0 py-3 border-b border-charcoal/20 font-sans text-sm text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent"
          />
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12 bg-pearl/90 backdrop-blur-sm p-8 shadow-md">
          <p className="font-sans text-sm text-charcoal/50">
            No menu items yet. Add your first item to get started.
          </p>
        </div>
      ) : groupedItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="font-sans text-sm text-charcoal/50">
            No items match your search.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedItems.map(({ category, items: groupItems }) => (
            <div key={category.id}>
              <h4 className="font-serif text-xl text-charcoal mb-3 font-light">
                {category.name}
              </h4>
              <div className="space-y-3">
                <AnimatePresence>
                  {groupItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`bg-pearl/90 backdrop-blur-sm shadow-md overflow-hidden ${
                        !item.is_available ? 'opacity-60' : ''
                      }`}
                    >
                      {deleteConfirm === item.id ? (
                        <div className="p-5 text-center">
                          <p className="font-sans text-sm text-charcoal/70 mb-3">
                            Delete &ldquo;{item.name}&rdquo;?
                          </p>
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deleting}
                              className="bg-crimson text-pearl font-sans text-xs uppercase tracking-wider py-2 px-4 hover:bg-charcoal transition-all disabled:opacity-40"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-wider py-2 px-4 hover:border-crimson transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4 p-4">
                          {/* Thumbnail */}
                          {item.image_url && (
                            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-charcoal/5">
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h5 className="font-serif text-lg text-charcoal truncate">
                                  {item.name}
                                </h5>
                                <p className="font-serif text-sm text-crimson">
                                  Rs. {Math.round(item.price) === item.price ? item.price : item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {!item.is_available && (
                                  <span className="font-sans text-[10px] uppercase tracking-wider text-charcoal/40 mr-2">
                                    Unavailable
                                  </span>
                                )}
                                <button
                                  onClick={() => handleToggleAvailability(item)}
                                  title={item.is_available ? 'Mark unavailable' : 'Mark available'}
                                  className={`w-8 h-8 flex items-center justify-center transition-colors ${
                                    item.is_available
                                      ? 'text-crimson/60 hover:text-crimson'
                                      : 'text-charcoal/30 hover:text-crimson'
                                  }`}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill={item.is_available ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => onEdit(item)}
                                  className="w-8 h-8 flex items-center justify-center text-charcoal/40 hover:text-crimson transition-colors"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(item.id)}
                                  className="w-8 h-8 flex items-center justify-center text-charcoal/40 hover:text-crimson transition-colors"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Dietary tags */}
                            {item.dietary_tags && item.dietary_tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.dietary_tags.map((tag: DietaryTag) => (
                                  <DietaryBadge key={tag} tag={tag} size="sm" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
