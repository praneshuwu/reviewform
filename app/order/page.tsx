'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import OrderForm from '@/components/orders/OrderForm';
import { useCart } from '@/lib/contexts/CartContext';
import type { MenuItem } from '@/lib/types';

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const itemId = searchParams.get('item');

    if (itemId) {
      setLoading(true);
      fetch('/api/menu')
        .then((res) => res.json())
        .then((data) => {
          const allItems: MenuItem[] = data.categories?.flatMap((cat: any) => cat.items) || [];
          const selectedItem = allItems.find((item) => item.id === itemId);

          if (selectedItem && selectedItem.is_available) {
            addItem(selectedItem, 1);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load menu item:', err);
          setLoading(false);
        });
    }
  }, [searchParams, addItem]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-2 border-crimson border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl">
      {/* Refined Header */}
      <header className="border-b border-charcoal/10 sticky top-0 z-50 bg-pearl/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/menu')}
              className="group flex items-center gap-2 text-charcoal/60 hover:text-crimson transition-colors duration-300"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="transition-transform duration-300 group-hover:-translate-x-1"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-sans text-xs uppercase tracking-[0.2em]">Menu</span>
            </button>

            <div className="text-center">
              <h1 className="font-serif text-3xl text-charcoal font-light tracking-tight">
                Place Your Order
              </h1>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-charcoal/40 mt-1">
                Kinchana's
              </p>
            </div>

            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <OrderForm
            onSuccess={(orderId, token) => {
              router.push(`/order/success?token=${token}`);
            }}
          />
        </motion.div>
      </main>

      {/* Decorative Footer Accent */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/20 to-transparent pointer-events-none" />
    </div>
  );
}
