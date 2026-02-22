'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ReviewNudge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="mt-10 pt-8 border-t border-charcoal/10"
    >
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-4">
        While you&apos;re here
      </p>
      <Link href="/menu">
        <motion.div
          whileHover={{ scale: 1.02, y: -2, boxShadow: '0 4px 12px rgba(139, 0, 0, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          className="bg-pearl border border-charcoal/20 hover:border-crimson p-6 transition-all cursor-pointer"
        >
          <p className="font-serif text-xl text-charcoal mb-1">
            Explore Our Menu
          </p>
          <p className="font-sans text-sm text-charcoal/60">
            Discover our full collection of handcrafted creations
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
