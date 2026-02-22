'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MenuCategory, MenuItem, DietaryTag } from '@/lib/types';
import { DIETARY_TAGS } from '@/lib/types';
import ImageUploader from './ImageUploader';

const TAG_LABELS: Record<DietaryTag, string> = {
  'vegan': 'Vegan',
  'vegetarian': 'Vegetarian',
  'gluten-free': 'Gluten-Free',
  'nut-free': 'Nut-Free',
  'dairy-free': 'Dairy-Free',
  'eggless': 'Eggless',
};

interface MenuItemFormProps {
  password: string;
  categories: MenuCategory[];
  existingItem?: MenuItem;
  onSave: () => void;
  onCancel: () => void;
}

export default function MenuItemForm({ password, categories, existingItem, onSave, onCancel }: MenuItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setDescription(existingItem.description);
      setPrice(existingItem.price.toString());
      setCategoryId(existingItem.category_id);
      setIsAvailable(existingItem.is_available);
      setDietaryTags(existingItem.dietary_tags || []);
      setImageUrl(existingItem.image_url || '');
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [existingItem, categories]);

  const toggleTag = (tag: DietaryTag) => {
    setDietaryTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError('Name is required'); return; }
    if (!categoryId) { setError('Please select a category'); return; }
    if (!price || isNaN(Number(price)) || Number(price) < 0) { setError('Please enter a valid price'); return; }

    setSaving(true);

    try {
      const body = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category_id: categoryId,
        is_available: isAvailable,
        dietary_tags: dietaryTags,
        image_url: imageUrl,
      };

      const url = existingItem
        ? `/api/admin/menu-items/${existingItem.id}`
        : '/api/admin/menu-items';

      const response = await fetch(url, {
        method: existingItem ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save item');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="relative w-full max-w-lg bg-pearl shadow-xl p-8 z-10 my-auto"
      >
        <h3 className="font-serif text-2xl text-charcoal mb-6 font-light">
          {existingItem ? 'Edit Menu Item' : 'Add Menu Item'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Belgian Chocolate Truffle Cake"
              className="w-full px-0 py-3 border-b border-charcoal/20 font-serif text-lg text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent"
              required
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-0 py-3 border-b border-charcoal/20 font-serif text-lg text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent appearance-none cursor-pointer"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-2">
              Price
            </label>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-charcoal/60">Rs.</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className="flex-1 px-0 py-3 border-b border-charcoal/20 font-serif text-lg text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the item..."
              rows={3}
              className="w-full px-0 py-3 border-b border-charcoal/20 font-sans text-sm text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-2">
              Image (Optional)
            </label>
            <ImageUploader
              password={password}
              currentImageUrl={imageUrl || undefined}
              onUpload={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl('')}
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between py-2">
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">
              Available
            </label>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`toggle-switch ${isAvailable ? 'bg-crimson' : 'bg-charcoal/20'}`}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-pearl shadow-sm"
                animate={{ left: isAvailable ? 20 : 3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-3">
              Dietary Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 font-sans text-xs uppercase tracking-wider transition-all ${
                    dietaryTags.includes(tag)
                      ? 'bg-crimson text-pearl'
                      : 'bg-pearl text-charcoal border border-charcoal/20 hover:border-crimson'
                  }`}
                >
                  {TAG_LABELS[tag]}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-crimson text-sm font-sans text-center bg-crimson/5 py-3 px-4"
            >
              {error}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-crimson text-pearl font-sans text-sm uppercase tracking-[0.2em] py-4 hover:bg-charcoal transition-all disabled:opacity-40"
            >
              {saving ? 'Saving...' : existingItem ? 'Update Item' : 'Add Item'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="border border-charcoal/20 text-charcoal font-sans text-sm uppercase tracking-[0.2em] py-4 px-6 hover:border-crimson transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
