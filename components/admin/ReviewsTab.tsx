'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Review } from '@/lib/types';

interface ReviewsTabProps {
  password: string;
}

export default function ReviewsTab({ password }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/reviews', {
        headers: { 'Authorization': `Bearer ${password}` },
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

  return (
    <div>
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
                      &ldquo;{review.favorite}&rdquo;
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
  );
}
