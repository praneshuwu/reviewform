'use client';

import { motion } from 'framer-motion';
import type { DietaryTag } from '@/lib/types';

const TAG_LABELS: Record<DietaryTag, string> = {
  'vegan': 'Vegan',
  'vegetarian': 'Vegetarian',
  'gluten-free': 'Gluten-Free',
  'nut-free': 'Nut-Free',
  'dairy-free': 'Dairy-Free',
  'eggless': 'Eggless',
};

interface MenuFilterProps {
  availableTags: DietaryTag[];
  activeFilters: DietaryTag[];
  onToggleFilter: (tag: DietaryTag) => void;
}

export default function MenuFilter({ availableTags, activeFilters, onToggleFilter }: MenuFilterProps) {
  const clearAll = () => {
    activeFilters.forEach((tag) => onToggleFilter(tag));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mb-12 md:mb-16"
    >
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 text-center mb-4">
        Dietary Preferences
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={clearAll}
          className={`px-4 py-2 font-sans text-xs uppercase tracking-wider transition-all ${
            activeFilters.length === 0
              ? 'bg-crimson text-pearl'
              : 'bg-pearl text-charcoal border border-charcoal/20 hover:border-crimson'
          }`}
        >
          All
        </motion.button>
        {availableTags.map((tag) => {
          const isActive = activeFilters.includes(tag);
          return (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleFilter(tag)}
              className={`px-4 py-2 font-sans text-xs uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-crimson text-pearl'
                  : 'bg-pearl text-charcoal border border-charcoal/20 hover:border-crimson'
              }`}
            >
              {TAG_LABELS[tag]}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
