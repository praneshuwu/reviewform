'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: number;
  name: string;
  phone: string;
  item: string;
  rating: number;
  would_order_again: string;
  favorite: string;
  improvements: string;
  feedback: string;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');

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
        fetchReviews();
      } else {
        setError('Invalid password');
        setPassword('');
      }
    } catch (err) {
      setError('Authentication failed');
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/reviews', {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = filter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === filter);

  const stats = {
    total: reviews.length,
    average: reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '0',
    fiveStars: reviews.filter(r => r.rating === 5).length,
    wouldOrderAgain: reviews.filter(r => r.would_order_again === 'Yes').length,
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
              Kinchana's
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
            Review Dashboard
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

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-pearl/90 backdrop-blur-sm p-6 shadow-md">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
              Total Reviews
            </p>
            <p className="font-serif text-4xl text-charcoal">{stats.total}</p>
          </div>

          <div className="bg-pearl/90 backdrop-blur-sm p-6 shadow-md">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
              Average Rating
            </p>
            <p className="font-serif text-4xl text-charcoal">
              {stats.average} <span className="text-2xl text-charcoal/40">/ 5</span>
            </p>
          </div>

          <div className="bg-pearl/90 backdrop-blur-sm p-6 shadow-md">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
              5-Star Reviews
            </p>
            <p className="font-serif text-4xl text-charcoal">{stats.fiveStars}</p>
          </div>

          <div className="bg-pearl/90 backdrop-blur-sm p-6 shadow-md">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
              Would Order Again
            </p>
            <p className="font-serif text-4xl text-charcoal">{stats.wouldOrderAgain}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-2 flex-wrap"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-sans text-xs uppercase tracking-wider transition-all ${
              filter === 'all'
                ? 'bg-crimson text-pearl'
                : 'bg-pearl/90 text-charcoal border border-charcoal/20 hover:border-crimson'
            }`}
          >
            All ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilter(rating as 5 | 4 | 3 | 2 | 1)}
              className={`px-4 py-2 font-sans text-xs uppercase tracking-wider transition-all ${
                filter === rating
                  ? 'bg-crimson text-pearl'
                  : 'bg-pearl/90 text-charcoal border border-charcoal/20 hover:border-crimson'
              }`}
            >
              {rating} ★ ({reviews.filter(r => r.rating === rating).length})
            </button>
          ))}
        </motion.div>

        {/* Reviews List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="font-sans text-charcoal/60">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-pearl/90 backdrop-blur-sm p-8">
              <p className="font-sans text-charcoal/60">No reviews yet</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-pearl/90 backdrop-blur-sm p-6 shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-2xl text-charcoal mb-1">
                        {review.name}
                      </h3>
                      {review.phone && (
                        <p className="font-sans text-sm text-charcoal/60">
                          {review.phone}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-crimson' : 'text-charcoal/20'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="font-sans text-xs text-charcoal/60">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-1">
                        Item
                      </p>
                      <p className="font-serif text-lg text-charcoal">{review.item}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-1">
                        Would Order Again
                      </p>
                      <p className="font-serif text-lg text-charcoal">
                        {review.would_order_again}
                      </p>
                    </div>
                  </div>

                  {review.favorite && (
                    <div className="mb-4">
                      <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
                        What Resonated
                      </p>
                      <p className="font-serif text-base text-charcoal/80 italic">
                        "{review.favorite}"
                      </p>
                    </div>
                  )}

                  {review.improvements && (
                    <div className="mb-4">
                      <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
                        Improvements
                      </p>
                      <p className="font-serif text-base text-charcoal/80">
                        {review.improvements}
                      </p>
                    </div>
                  )}

                  {review.feedback && (
                    <div>
                      <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
                        Additional Thoughts
                      </p>
                      <p className="font-serif text-base text-charcoal/80">
                        {review.feedback}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}
