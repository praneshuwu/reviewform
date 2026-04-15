'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import type { MenuItem } from '@/lib/types';

interface OrderModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function OrderModal({ item, onClose }: OrderModalProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    const rounded = Math.round(price);
    return rounded === price ? `${rounded}` : price.toFixed(2);
  };

  const handleAddToCart = () => {
    addItem(item, quantity);
    onClose();
    // Optional: Show a subtle toast notification
  };

  const handlePlaceOrder = () => {
    addItem(item, quantity);
    router.push('/order');
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      {/* Backdrop with subtle blur */}
      <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-md" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-pearl shadow-2xl z-10 overflow-hidden"
      >
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-crimson to-transparent opacity-60" />

        {/* Close button - minimal, elegant */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-charcoal/30 hover:text-crimson transition-colors duration-300 z-10 group"
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="transition-transform duration-300 group-hover:rotate-90"
          >
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="p-12">
          {/* Item Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="font-serif text-4xl text-charcoal font-light tracking-tight mb-3">
              {item.name}
            </h2>

            {item.description && (
              <p className="font-sans text-sm text-charcoal/60 leading-relaxed mb-6 max-w-md">
                {item.description}
              </p>
            )}

            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl text-crimson font-light">
                ₹{formatPrice(item.price)}
              </span>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/40">
                per unit
              </span>
            </div>
          </motion.div>

          {/* Quantity Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <label className="block mb-4 font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">
              Quantity
            </label>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-12 h-12 border border-charcoal/20 flex items-center justify-center text-charcoal hover:border-crimson hover:text-crimson transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <span className="font-serif text-3xl text-charcoal font-light min-w-[3rem] text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 border border-charcoal/20 flex items-center justify-center text-charcoal hover:border-crimson hover:text-crimson transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Subtotal */}
            <div className="mt-6 pt-6 border-t border-charcoal/10 flex items-baseline justify-between">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/50">
                Subtotal
              </span>
              <span className="font-serif text-2xl text-charcoal font-light">
                ₹{formatPrice(item.price * quantity)}
              </span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors duration-300 group relative overflow-hidden"
            >
              <span className="relative z-10">Continue to Order</span>
              <div className="absolute inset-0 bg-charcoal transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </button>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-[0.2em] hover:border-crimson hover:text-crimson transition-all duration-300"
            >
              Add to Cart
            </button>
          </motion.div>

          {/* Optional: Decorative corner accents */}
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-crimson/20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-crimson/20" />
        </div>
      </motion.div>
    </motion.div>
  );
}
