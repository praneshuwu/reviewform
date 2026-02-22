'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminTabs from '@/components/admin/AdminTabs';
import ReviewsTab from '@/components/admin/ReviewsTab';
import MenuTab from '@/components/admin/MenuTab';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'reviews' | 'menu'>('reviews');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setError('Invalid password');
        setPassword('');
      }
    } catch (err) {
      setError('Authentication failed');
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pearl via-rose/5 to-pearl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-pearl/90 backdrop-blur-sm p-10 shadow-lg"
        >
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl text-charcoal mb-2 font-light">
              Kinchana&apos;s
            </h1>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-charcoal/60">
              Admin Dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="admin-password"
                className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-3"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-3 border-b border-charcoal/20 font-serif text-lg text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent"
                placeholder="Enter admin password"
                autoFocus
                required
                aria-label="Admin password"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-crimson text-sm font-sans text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full bg-crimson text-pearl font-sans text-sm uppercase tracking-[0.2em] py-4 hover:bg-charcoal transition-all"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl via-rose/5 to-pearl p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-5xl text-charcoal mb-2 font-light">
            Admin Dashboard
          </h1>
          <p className="font-sans text-sm text-charcoal/60">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </motion.div>

        {/* Tabs */}
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'reviews' && <ReviewsTab password={password} />}
        {activeTab === 'menu' && <MenuTab password={password} />}
      </div>
    </div>
  );
}
