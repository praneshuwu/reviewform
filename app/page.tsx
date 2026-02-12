'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LuxuryForm() {
  const [step, setStep] = useState<'intro' | 'form'>('intro');
  const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    item: '',
    rating: 0,
    wouldOrderAgain: '',
    favorite: '',
    improvements: '',
    feedback: '',
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Smart autofocus when form loads
  useEffect(() => {
    if (step === 'form' && !isAnonymous && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [step, isAnonymous]);

  // Calculate progress based on all fields (subtle nudge to complete everything)
  const getProgress = () => {
    const allFields = [
      formData.item,
      formData.rating > 0,
      formData.wouldOrderAgain,
      formData.favorite.trim(),
      formData.improvements.trim(),
      formData.feedback.trim(),
    ];

    // Add name if not anonymous (phone is optional)
    if (!isAnonymous) {
      allFields.unshift(formData.name.trim());
    }

    const completed = allFields.filter(Boolean).length;
    const total = allFields.length;

    // If submitting, show 100%
    if (isSubmitting) return 100;

    return (completed / total) * 100;
  };

  // Validate phone number (10 digits starting with 6-9)
  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');

    // Check if it's a valid Indian phone number (10 digits starting with 6-9)
    if (digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly)) {
      return true;
    }

    return false;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only keep digits, limit to 10
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: digitsOnly });

    // Validate if user has typed enough
    if (digitsOnly.length >= 10) {
      if (!validatePhone(digitsOnly)) {
        setPhoneError('Please enter a valid mobile number');
      } else {
        setPhoneError(null);
      }
    } else if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      // Show subtle error if they've started typing but haven't reached 10 digits
      setPhoneError(null);
    } else {
      setPhoneError(null);
    }
  };

  // Format phone for display and submission
  const getFormattedPhone = (phone: string): string => {
    if (!phone) return '';
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length <= 4) {
      return `+91-${digitsOnly}`;
    }
    return `+91-${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 10)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate phone if not anonymous and phone is provided
    if (!isAnonymous && formData.phone && !validatePhone(formData.phone)) {
      setPhoneError('Please enter a valid mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = isAnonymous
        ? { ...formData, name: 'Anonymous', phone: '' }
        : { ...formData, phone: formData.phone ? getFormattedPhone(formData.phone) : '' };

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setError('Unable to submit your feedback. Please try again.');
      }
    } catch (error) {
      setError('A network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle keyboard navigation for star rating
  const handleStarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setFormData({ ...formData, rating: Math.min(5, formData.rating + 1) });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setFormData({ ...formData, rating: Math.max(1, formData.rating - 1) });
    }
  };

  // Trigger celebration for 5-star rating
  useEffect(() => {
    if (formData.rating === 5) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }, [formData.rating]);

  const items = ['Cakes', 'Brownies', 'Cheesecakes', 'Pastries'];

  // Intro Screen
  if (step === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="font-serif text-6xl md:text-7xl text-charcoal mb-6 font-light elegant-underline">
                Kinchana's
              </h1>
              <p className="font-sans text-sm uppercase tracking-[0.3em] text-charcoal/60">
                Baked with Love
              </p>
            </motion.div>
          </div>

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
              Your Perspective Matters
            </h2>
            <p className="font-sans text-base text-charcoal/70 leading-relaxed text-center max-w-lg mx-auto">
              We craft each creation with care and intention. Your thoughtful feedback helps us refine our art. This brief survey takes approximately two minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="luxury-shadow bg-pearl/90 backdrop-blur-sm p-8 md:p-10"
          >
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 text-center mb-6">
              Select Your Preference
            </p>
            <div className="space-y-4">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  boxShadow: "0 4px 12px rgba(139, 0, 0, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsAnonymous(false);
                  setStep('form');
                }}
                className="w-full bg-crimson text-pearl font-sans text-sm uppercase tracking-[0.1em] py-5 hover:bg-charcoal transition-all"
              >
                <div className="font-serif text-lg normal-case mb-1">Share with Identity</div>
                <div className="text-xs opacity-80 tracking-normal">Provide your name (phone optional)</div>
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  boxShadow: "0 4px 12px rgba(139, 0, 0, 0.10)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsAnonymous(true);
                  setStep('form');
                }}
                className="w-full bg-pearl text-charcoal font-sans text-sm uppercase tracking-[0.1em] py-5 border border-charcoal/20 hover:border-crimson transition-all"
              >
                <div className="font-serif text-lg normal-case mb-1">Remain Anonymous</div>
                <div className="text-xs opacity-70 tracking-normal">No personal information</div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 100,
                x: Math.random() * window.innerWidth,
              }}
              animate={{
                opacity: [0, 0.3, 0],
                y: -100,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: i * 0.3,
                ease: "easeOut"
              }}
              className="absolute text-crimson/20 text-4xl"
            >
              ✦
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl w-full luxury-shadow bg-pearl/90 backdrop-blur-sm p-12 md:p-16 text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-16 h-16 mx-auto mb-8 rounded-full bg-crimson/10 flex items-center justify-center relative"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-crimson"
            ></motion.div>
          </motion.div>
          <h2 className="font-serif text-5xl md:text-6xl text-charcoal mb-6 font-light">
            Thank you
          </h2>
          <p className="font-sans text-base text-charcoal/70 leading-relaxed tracking-wide">
            Your feedback has been graciously received.
            <br />
            We value your time and insights deeply.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Progress Indicator - Sticky (only show on form) */}
      {step === 'form' && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 bg-pearl/80 backdrop-blur-sm py-3 px-4 border-b border-charcoal/5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="h-1 bg-charcoal/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-crimson rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}

      <div className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-24 px-4">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-2xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="font-serif text-6xl md:text-7xl text-charcoal mb-6 font-light elegant-underline">
              Kinchana's
            </h1>
            <p className="font-sans text-sm uppercase tracking-[0.3em] text-charcoal/60 mb-8">
              Baked with Love
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-sans text-base md:text-lg text-charcoal/70 leading-relaxed max-w-lg mx-auto"
          >
            We craft each creation with care and intention. Your thoughtful feedback helps us refine our art.
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-8 md:space-y-10"
        >
          {/* Name & Email - Only show if not anonymous */}
          {!isAnonymous && (
            <>
              <div>
                <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-3">
                  Your Name
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-0 py-3 border-b border-charcoal/20 font-serif text-lg md:text-xl text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent"
                  placeholder="e.g., Sarah Chen"
                />
              </div>

              <div>
                <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-3">
                  Phone Number
                </label>
                <div className="relative flex items-center gap-2">
                  <span className="font-serif text-lg md:text-xl text-charcoal/60 pb-3">
                    +91-
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`w-full px-0 py-3 border-b ${
                        phoneError
                          ? 'border-crimson'
                          : formData.phone.length === 10 && validatePhone(formData.phone)
                          ? 'border-crimson/30'
                          : 'border-charcoal/20'
                      } font-serif text-lg md:text-xl text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent`}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                    {formData.phone && (
                      <div className="absolute right-0 top-3">
                        {formData.phone.length === 10 && validatePhone(formData.phone) ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-crimson text-sm"
                          >
                            ✓
                          </motion.div>
                        ) : phoneError ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-crimson/50 text-sm"
                          >
                            ✕
                          </motion.div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
                {phoneError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-crimson text-xs font-sans mt-2 tracking-wide"
                  >
                    {phoneError}
                  </motion.p>
                )}
                <p className="text-charcoal/40 text-xs font-sans mt-2 tracking-wide">
                  Optional — Only if you'd like us to reach you
                </p>
              </div>
            </>
          )}

          {/* Item */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-4">
              What Did You Experience?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {items.map((item) => (
                <motion.button
                  key={item}
                  type="button"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "inset 0 0 0 1px #8B0000"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, item })}
                  className={`py-4 font-sans text-sm tracking-wider border transition-all ${
                    formData.item === item
                      ? 'bg-crimson text-pearl border-crimson'
                      : 'bg-pearl text-charcoal border-charcoal/20 hover:border-crimson'
                  }`}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-6 text-center">
              Your Rating
            </label>
            <div
              className="flex gap-6 justify-center relative w-fit mx-auto"
              onKeyDown={handleStarKeyDown}
              role="radiogroup"
              aria-label="Rating"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-all rating-star focus:outline-none"
                  aria-label={`Rate ${star} out of 5 stars`}
                  role="radio"
                  aria-checked={formData.rating === star}
                  tabIndex={0}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill={star <= (hoverRating || formData.rating) ? '#8B0000' : 'none'}
                    stroke={star <= (hoverRating || formData.rating) ? '#8B0000' : '#2C2C2C'}
                    strokeWidth="1"
                    className="transition-all"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </motion.button>
              ))}

              {/* 5-star celebration */}
              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -right-10 top-0"
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 0.6, repeat: 2 }}
                      className="text-3xl"
                    >
                      ✨
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {formData.rating > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center font-sans text-sm text-charcoal/60 mt-4 tracking-wide"
              >
                {formData.rating === 1 && 'We sincerely apologize'}
                {formData.rating === 2 && 'We appreciate your honesty'}
                {formData.rating === 3 && 'Thank you for your feedback'}
                {formData.rating === 4 && 'We are pleased you enjoyed it'}
                {formData.rating === 5 && 'Exceptional — thank you'}
              </motion.p>
            )}
          </div>

          {/* Would Order Again */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-4">
              Would You Order More From Us?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: 'Certainly', value: 'Yes' },
                { label: 'Perhaps', value: 'Maybe' },
                { label: 'Unlikely', value: 'No' },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, wouldOrderAgain: option.value })}
                  className={`py-4 font-sans text-sm tracking-wider border transition-all ${
                    formData.wouldOrderAgain === option.value
                      ? 'bg-crimson text-pearl border-crimson'
                      : 'bg-pearl text-charcoal border-charcoal/20 hover:border-crimson'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Favorite */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-3">
              What Resonated Most?
            </label>
            <input
              type="text"
              value={formData.favorite}
              onChange={(e) => setFormData({ ...formData, favorite: e.target.value })}
              className="w-full px-0 py-3 border-b border-charcoal/20 font-serif text-lg md:text-xl text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent"
              placeholder="Perhaps the richness, the texture, the presentation..."
            />
          </div>

          {/* Improvements */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-3">
              How Might We Improve?
            </label>
            <input
              type="text"
              value={formData.improvements}
              onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
              className="w-full px-0 py-3 border-b border-charcoal/20 font-serif text-lg md:text-xl text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent"
              placeholder="We welcome all constructive thoughts..."
            />
          </div>

          {/* Feedback */}
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-3">
              Additional Thoughts
            </label>
            <textarea
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              rows={5}
              className="w-full px-0 py-3 border-b border-charcoal/20 font-serif text-lg md:text-xl text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent resize-none"
              placeholder="Take your time. We read every word carefully."
            />
          </div>

          {/* Submit */}
          <div className="pt-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-crimson text-sm font-sans mb-4 text-center tracking-wide bg-crimson/5 py-3 px-4 rounded"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting || formData.rating === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-crimson text-pearl font-sans text-sm uppercase tracking-[0.25em] py-5 hover:bg-charcoal transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isSubmitting ? (
                <span className="flex gap-1 justify-center items-center">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    •
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  >
                    •
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  >
                    •
                  </motion.span>
                </span>
              ) : (
                'Submit Feedback'
              )}
            </motion.button>
          </div>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center font-sans text-xs text-charcoal/50 mt-12 tracking-wider"
        >
          Your information is held in strict confidence
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="text-center font-serif text-sm text-charcoal/60 mt-3 italic"
        >
          Every word you share shapes our craft with intention
        </motion.p>
      </motion.div>
      </div>
    </>
  );
}
