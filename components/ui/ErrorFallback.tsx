'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
  message?: string;
}

export default function ErrorFallback({ error, reset, message }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full luxury-shadow bg-pearl/90 backdrop-blur-sm p-10 text-center"
      >
        <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-crimson/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-crimson"></div>
        </div>
        <h2 className="font-serif text-3xl text-charcoal mb-4 font-light">
          Something went wrong
        </h2>
        <p className="font-sans text-sm text-charcoal/70 mb-8 leading-relaxed">
          {message || 'We apologize for the inconvenience. Please try again.'}
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-crimson text-pearl font-sans text-sm uppercase tracking-[0.2em] py-3 hover:bg-charcoal transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="block w-full border border-charcoal/20 text-charcoal font-sans text-sm uppercase tracking-[0.2em] py-3 hover:border-crimson transition-all"
          >
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
