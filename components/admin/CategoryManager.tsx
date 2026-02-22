'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuCategory } from '@/lib/types';

interface CategoryManagerProps {
  password: string;
  categories: MenuCategory[];
  onCategoriesChange: () => void;
}

export default function CategoryManager({ password, categories, onCategoriesChange }: CategoryManagerProps) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const authHeaders = {
    'Authorization': `Bearer ${password}`,
    'Content-Type': 'application/json',
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim(),
          display_order: categories.length,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create category');
      }

      setNewName('');
      setNewDescription('');
      onCategoriesChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: MenuCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/categories/${editingId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update category');
      }

      setEditingId(null);
      onCategoriesChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setDeleteConfirm(null);
      onCategoriesChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Add new category */}
      <form onSubmit={handleAdd} className="bg-pearl/90 backdrop-blur-sm p-6 shadow-md mb-6">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-4">
          Add New Category
        </p>
        <div className="space-y-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="w-full px-0 py-3 border-b border-charcoal/20 font-serif text-lg text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent"
            required
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-0 py-3 border-b border-charcoal/20 font-sans text-sm text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent"
          />
          <button
            type="submit"
            disabled={saving || !newName.trim()}
            className="bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] py-3 px-6 hover:bg-charcoal transition-all disabled:opacity-40"
          >
            {saving ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-crimson text-sm font-sans mb-4 text-center bg-crimson/5 py-3 px-4"
        >
          {error}
        </motion.div>
      )}

      {/* Categories list */}
      <div className="space-y-3">
        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-pearl/90 backdrop-blur-sm p-5 shadow-md"
            >
              {editingId === category.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-0 py-2 border-b border-crimson font-serif text-lg text-charcoal focus:outline-none bg-transparent"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full px-0 py-2 border-b border-charcoal/20 font-sans text-sm text-charcoal focus:outline-none focus:border-crimson bg-transparent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="bg-crimson text-pearl font-sans text-xs uppercase tracking-wider py-2 px-4 hover:bg-charcoal transition-all disabled:opacity-40"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-wider py-2 px-4 hover:border-crimson transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : deleteConfirm === category.id ? (
                <div className="text-center py-2">
                  <p className="font-sans text-sm text-charcoal/70 mb-3">
                    Delete &ldquo;{category.name}&rdquo;? This will also delete all its menu items.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={saving}
                      className="bg-crimson text-pearl font-sans text-xs uppercase tracking-wider py-2 px-4 hover:bg-charcoal transition-all disabled:opacity-40"
                    >
                      Confirm Delete
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
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-xl text-charcoal">{category.name}</h4>
                    {category.description && (
                      <p className="font-sans text-sm text-charcoal/60 mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="font-sans text-xs uppercase tracking-wider text-charcoal/50 hover:text-crimson transition-colors py-1 px-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(category.id)}
                      className="font-sans text-xs uppercase tracking-wider text-charcoal/50 hover:text-crimson transition-colors py-1 px-3"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {categories.length === 0 && (
          <div className="text-center py-8">
            <p className="font-sans text-sm text-charcoal/50">
              No categories yet. Create one above to start building your menu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
