'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full"
      >
        {/* Brand Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="font-serif text-6xl md:text-7xl text-charcoal mb-6 font-light elegant-underline">
              Kinchana&apos;s
            </h1>
            <p className="font-sans text-sm uppercase tracking-[0.3em] text-charcoal/60">
              Baked with Love
            </p>
          </motion.div>
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="luxury-shadow bg-pearl/90 backdrop-blur-sm p-10 md:p-12 mb-8"
        >
          <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-crimson/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-crimson"></div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6 font-light text-center">
            Welcome
          </h2>
          <p className="font-sans text-base text-charcoal/70 leading-relaxed text-center max-w-lg mx-auto">
            We craft each creation with care and intention — from rich, layered cakes to delicate pastries. Explore what we offer or share your thoughts with us.
          </p>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="space-y-4"
        >
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 text-center mb-6">
            What would you like to do?
          </p>

          {/* Our Menu */}
          <Link href="/menu" className="block">
            <motion.div
              whileHover={{
                scale: 1.02,
                y: -2,
                boxShadow: '0 4px 12px rgba(139, 0, 0, 0.15)',
              }}
              whileTap={{ scale: 0.98 }}
              className="luxury-shadow bg-crimson text-pearl p-8 md:p-10 transition-all cursor-pointer hover:bg-charcoal"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-pearl/15 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-pearl">
                    <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light mb-2">
                    Our Menu
                  </h3>
                  <p className="font-sans text-sm opacity-80 leading-relaxed">
                    Explore our handcrafted collection of cakes, brownies, cheesecakes, pastries, and more
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Share Your Experience */}
          <Link href="/review" className="block">
            <motion.div
              whileHover={{
                scale: 1.02,
                y: -2,
                boxShadow: '0 4px 12px rgba(139, 0, 0, 0.10)',
              }}
              whileTap={{ scale: 0.98 }}
              className="luxury-shadow bg-pearl/90 backdrop-blur-sm text-charcoal p-8 md:p-10 border border-charcoal/20 hover:border-crimson transition-all cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-crimson">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light mb-2">
                    Share Your Experience
                  </h3>
                  <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                    Your thoughtful feedback helps us refine our art — it only takes two minutes
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-center font-serif text-sm text-charcoal/60 mt-12 italic"
        >
          Every creation tells a story
        </motion.p>
      </motion.div>
    </div>
  );
}
