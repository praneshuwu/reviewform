'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import DietaryBadge from '@/components/ui/DietaryBadge';

interface MenuItemCardProps {
  item: MenuItem;
  animationDelay: number;
  onOrder: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, animationDelay, onOrder }: MenuItemCardProps) {
  const formatPrice = (price: number) => {
    const rounded = Math.round(price);
    return rounded === price ? `Rs. ${rounded}` : `Rs. ${price.toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(139, 0, 0, 0.12)' }}
      onClick={() => onOrder(item)}
      className="luxury-shadow bg-pearl/90 backdrop-blur-sm overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      {item.image_url && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover menu-image-hover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle gradient overlay at bottom for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-charcoal/10 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Name and Price row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-serif text-xl text-charcoal font-light leading-tight">
            {item.name}
          </h3>
          <span className="font-serif text-lg text-crimson whitespace-nowrap flex-shrink-0">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Thin decorative line */}
        <div className="w-8 h-px bg-crimson/30 mb-3" />

        {/* Description */}
        {item.description && (
          <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-4">
            {item.description}
          </p>
        )}

        {/* Dietary badges */}
        {item.dietary_tags && item.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.dietary_tags.map((tag) => (
              <DietaryBadge key={tag} tag={tag} size="sm" />
            ))}
          </div>
        )}

        {/* Order hint */}
        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-crimson/50 group-hover:text-crimson transition-colors">
          Tap to order
        </p>
      </div>
    </motion.div>
  );
}
