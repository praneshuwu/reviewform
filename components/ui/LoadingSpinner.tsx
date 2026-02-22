'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <span className="flex gap-1 justify-center items-center text-charcoal/60 text-2xl">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          &bull;
        </motion.span>
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        >
          &bull;
        </motion.span>
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        >
          &bull;
        </motion.span>
      </span>
      {message && (
        <p className="font-sans text-sm text-charcoal/60 mt-4 tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}
