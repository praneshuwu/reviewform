'use client';

import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '@/lib/contexts/CartContext';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const token = searchParams.get('token');

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (!token) {
    router.push('/menu');
    return null;
  }

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-rose/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-crimson/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative max-w-2xl w-full text-center"
      >
        {/* Success Icon with Elegant Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 100 }}
          className="relative inline-block mb-12"
        >
          <div className="w-32 h-32 border-2 border-crimson/20 rounded-full flex items-center justify-center relative">
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B0000"
                strokeWidth="1.5"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
                />
              </svg>
            </motion.div>
          </div>
          {/* Decorative corner accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-crimson/40" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-crimson/40" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-crimson/40" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-crimson/40" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-serif text-6xl text-charcoal font-light mb-4 tracking-tight">
            Order Received
          </h1>
          <p className="font-sans text-sm text-charcoal/60 tracking-wide leading-relaxed max-w-md mx-auto">
            Thank you for your order. We'll review your request and confirm availability within{' '}
            <span className="text-crimson font-medium">24 hours</span>.
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12 border border-charcoal/10 p-10 text-left"
        >
          <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-6">
            What Happens Next
          </h2>
          <div className="space-y-4">
            {[
              { icon: '01', text: 'Confirmation email sent to your inbox' },
              { icon: '02', text: 'Order reviewed for availability' },
              { icon: '03', text: 'Email notification when confirmed' },
              { icon: '04', text: 'Reminder sent before delivery' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1, duration: 0.4 }}
                className="flex items-start gap-4 group"
              >
                <span className="font-serif text-xl text-crimson/40 group-hover:text-crimson transition-colors">
                  {item.icon}
                </span>
                <span className="font-sans text-sm text-charcoal/80 leading-relaxed pt-0.5">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => router.push(`/order/status/${token}`)}
            className="group px-10 py-4 bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors duration-300 relative overflow-hidden"
          >
            <span className="relative z-10">Track Your Order</span>
            <div className="absolute inset-0 bg-charcoal transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </button>

          <button
            onClick={() => router.push('/menu')}
            className="px-10 py-4 border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-[0.2em] hover:border-charcoal transition-colors duration-300"
          >
            Browse Menu
          </button>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12 pt-12 border-t border-charcoal/10"
        >
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-4">
            Questions?
          </p>
          <a
            href="https://wa.me/919080370407"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-charcoal/60 hover:text-crimson transition-colors group"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="font-sans text-sm tracking-wide">Contact Us</span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
