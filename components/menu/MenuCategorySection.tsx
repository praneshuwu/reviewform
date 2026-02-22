'use client';

import { motion } from 'framer-motion';
import type { MenuCategoryWithItems, MenuItem } from '@/lib/types';
import MenuItemCard from './MenuItemCard';

interface MenuCategorySectionProps {
  category: MenuCategoryWithItems;
  animationDelay: number;
  onOrder: (item: MenuItem) => void;
}

export default function MenuCategorySection({ category, animationDelay, onOrder }: MenuCategorySectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.8, ease: 'easeOut' }}
      className="mb-16 md:mb-20"
    >
      {/* Category header */}
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-light elegant-underline mb-4">
          {category.name}
        </h2>
        {category.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animationDelay + 0.2, duration: 0.6 }}
            className="font-sans text-base text-charcoal/70 max-w-lg mx-auto mt-6 leading-relaxed"
          >
            {category.description}
          </motion.p>
        )}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.items.map((item, index) => (
          <MenuItemCard
            key={item.id}
            item={item}
            animationDelay={animationDelay + 0.3 + index * 0.05}
            onOrder={onOrder}
          />
        ))}
      </div>
    </motion.section>
  );
}
