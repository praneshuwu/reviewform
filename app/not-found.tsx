'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="font-serif text-6xl md:text-7xl text-charcoal mb-6 font-light elegant-underline">
            Kinchana&apos;s
          </h1>
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-charcoal/60 mb-12">
            Baked with Love
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="luxury-shadow bg-pearl/90 backdrop-blur-sm p-10"
        >
          <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-crimson/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-crimson"></div>
          </div>
          <h2 className="font-serif text-3xl text-charcoal mb-4 font-light">
            Page Not Found
          </h2>
          <p className="font-sans text-sm text-charcoal/70 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-crimson text-pearl font-sans text-sm uppercase tracking-[0.2em] py-3 hover:bg-charcoal transition-all"
            >
              Return Home
            </Link>
            <div className="flex gap-3">
              <Link
                href="/menu"
                className="flex-1 border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-[0.2em] py-3 hover:border-crimson transition-all text-center"
              >
                Our Menu
              </Link>
              <Link
                href="/review"
                className="flex-1 border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-[0.2em] py-3 hover:border-crimson transition-all text-center"
              >
                Leave a Review
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
