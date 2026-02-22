'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { MenuCategoryWithItems, MenuItem, DietaryTag } from '@/lib/types';
import MenuCategorySection from '@/components/menu/MenuCategorySection';
import MenuFilter from '@/components/menu/MenuFilter';
import OrderModal from '@/components/menu/OrderModal';
import OrderInfoFAB from '@/components/menu/OrderInfoFAB';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuCategoryWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDietaryFilters, setActiveDietaryFilters] = useState<DietaryTag[]>([]);
  const [orderItem, setOrderItem] = useState<MenuItem | null>(null);

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      setMenu(data.categories || []);
    } catch (err) {
      setError('Unable to load our menu at the moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Collect all unique dietary tags across all menu items
  const availableTags = useMemo(() => {
    const tagSet = new Set<DietaryTag>();
    menu.forEach((cat) =>
      cat.items.forEach((item) =>
        item.dietary_tags?.forEach((tag) => tagSet.add(tag))
      )
    );
    return Array.from(tagSet);
  }, [menu]);

  // Filter categories and items by active dietary filters
  const filteredMenu = useMemo(() => {
    if (activeDietaryFilters.length === 0) return menu;

    return menu
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          activeDietaryFilters.every((tag) => item.dietary_tags?.includes(tag))
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [menu, activeDietaryFilters]);

  const handleToggleFilter = (tag: DietaryTag) => {
    setActiveDietaryFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <div className="pt-12 md:pt-20 pb-8 md:pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-center"
        >
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-6xl md:text-7xl text-charcoal mb-6 font-light elegant-underline">
              Kinchana&apos;s
            </h1>
          </Link>
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-charcoal/60 mb-4">
            Baked with Love
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mt-8"
        >
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-2">
            Our Collection
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-light">
            The Menu
          </h2>
        </motion.div>
      </div>

      {/* Floating Order FAB */}
      {!loading && !error && menu.length > 0 && <OrderInfoFAB />}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12 md:pb-24">
        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Preparing our menu..." />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="luxury-shadow bg-pearl/90 backdrop-blur-sm p-10 text-center max-w-md mx-auto"
          >
            <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-crimson/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-crimson"></div>
            </div>
            <p className="font-sans text-sm text-charcoal/70 mb-6">{error}</p>
            <button
              onClick={fetchMenu}
              className="bg-crimson text-pearl font-sans text-sm uppercase tracking-[0.2em] py-3 px-8 hover:bg-charcoal transition-all"
            >
              Try Again
            </button>
          </motion.div>
        ) : menu.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="luxury-shadow bg-pearl/90 backdrop-blur-sm p-12 md:p-16 text-center max-w-lg mx-auto"
          >
            <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-crimson/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-crimson"></div>
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-4 font-light">
              Coming Soon
            </h3>
            <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-8">
              Our menu is being curated. Please check back soon.
            </p>
            <Link
              href="/review"
              className="inline-block bg-pearl border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-[0.2em] py-3 px-8 hover:border-crimson transition-all"
            >
              Leave a Review
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Dietary filter - only shown if tags exist */}
            {availableTags.length > 0 && (
              <MenuFilter
                availableTags={availableTags}
                activeFilters={activeDietaryFilters}
                onToggleFilter={handleToggleFilter}
              />
            )}

            {/* No results after filtering */}
            {filteredMenu.length === 0 && activeDietaryFilters.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="font-sans text-sm text-charcoal/60 mb-2">
                  No items match your dietary preferences.
                </p>
                <button
                  onClick={() => setActiveDietaryFilters([])}
                  className="font-sans text-xs uppercase tracking-[0.2em] text-crimson hover:text-charcoal transition-colors mt-2"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              /* Category sections */
              filteredMenu.map((category, index) => (
                <MenuCategorySection
                  key={category.id}
                  category={category}
                  animationDelay={0.5 + index * 0.15}
                  onOrder={setOrderItem}
                />
              ))
            )}

            {/* Footer CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 md:mt-12 pt-12 border-t border-charcoal/10 text-center"
            >
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-4">
                Tried something from our menu?
              </p>
              <Link href="/review">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block bg-crimson text-pearl font-sans text-sm uppercase tracking-[0.2em] py-4 px-10 hover:bg-charcoal transition-all"
                >
                  Share Your Experience
                </motion.span>
              </Link>
            </motion.div>
          </>
        )}

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/40 hover:text-crimson transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {orderItem && (
          <OrderModal
            item={orderItem}
            onClose={() => setOrderItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
