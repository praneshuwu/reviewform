'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';
import DatePicker from './DatePicker';

interface OrderFormProps {
  onSuccess?: (orderId: string, token: string) => void;
}

export default function OrderForm({ onSuccess }: OrderFormProps) {
  const router = useRouter();
  const { items, totalAmount, updateQuantity, removeItem } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Validation state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const getMinDate = () => {
    const minDays = parseInt(process.env.NEXT_PUBLIC_MIN_ORDER_DAYS_AHEAD || '2', 10);
    const date = new Date();
    date.setDate(date.getDate() + minDays);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    date.setHours(23, 59, 59, 999);
    return date;
  };

  // Validation functions
  const validateName = (value: string): string => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s.]+$/.test(value)) {
      return 'Name should only contain letters and spaces';
    }
    return '';
  };

  const validateEmail = (value: string): string => {
    if (!value.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhone = (value: string): string => {
    if (!value.trim()) {
      return 'Phone number is required';
    }
    if (!/^\d{10}$/.test(value)) {
      return 'Phone number must be exactly 10 digits';
    }
    return '';
  };

  // Handle input changes with validation
  const handleNameChange = (value: string) => {
    setCustomerName(value);
    if (touched.name) {
      setNameError(validateName(value));
    }
  };

  const handleEmailChange = (value: string) => {
    setCustomerEmail(value);
    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
    setCustomerPhone(digitsOnly);
    if (touched.phone) {
      setPhoneError(validatePhone(digitsOnly));
    }
  };

  const handleNext = () => {
    setError('');

    if (step === 1 && items.length === 0) {
      setError('Please add at least one item to your order');
      return;
    }

    if (step === 2 && !deliveryDate) {
      setError('Please select a delivery date');
      return;
    }

    if (step === 3) {
      // Mark all fields as touched
      setTouched({ name: true, email: true, phone: true });

      // Validate all fields
      const nameErr = validateName(customerName);
      const emailErr = validateEmail(customerEmail);
      const phoneErr = validatePhone(customerPhone);

      setNameError(nameErr);
      setEmailError(emailErr);
      setPhoneError(phoneErr);

      // If any errors, don't proceed
      if (nameErr || emailErr || phoneErr) {
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone.startsWith('+91-') ? customerPhone : `+91-${customerPhone}`,
          delivery_date: deliveryDate ? deliveryDate.toISOString().split('T')[0] : '',
          order_items: items,
          special_instructions: specialInstructions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      if (onSuccess) {
        onSuccess(data.order_id, data.confirmation_token);
      } else {
        router.push(`/order/success?token=${data.confirmation_token}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const stepLabels = ['Selection', 'Delivery', 'Details', 'Review'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Elegant Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3">
          {[1, 2, 3, 4].map((num, idx) => (
            <div key={num} className="flex items-center" style={{ width: idx < 3 ? '100%' : 'auto' }}>
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: step >= num ? '#8B0000' : '#E5E5E5',
                  scale: step === num ? 1.1 : 1,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
              >
                <span
                  className="font-serif text-sm font-light transition-colors duration-300"
                  style={{ color: step >= num ? '#FEFEFE' : '#999' }}
                >
                  {num}
                </span>
              </motion.div>
              {idx < 3 && (
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: step > num ? '#8B0000' : '#E5E5E5',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="h-px flex-1 mx-3"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between px-1">
          {stepLabels.map((label, idx) => (
            <motion.span
              key={label}
              initial={false}
              animate={{
                color: step === idx + 1 ? '#8B0000' : '#999',
                fontWeight: step === idx + 1 ? 500 : 400,
              }}
              className="font-sans text-xs uppercase tracking-[0.15em]"
            >
              {label}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Payment Reassurance Notice */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 p-6 bg-gradient-to-r from-rose/20 to-pearl border border-crimson/20 flex items-start gap-4"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B0000" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className="font-sans text-sm text-charcoal/90 leading-relaxed">
            <span className="font-semibold">No payment required now.</span> This is only a confirmation request.
            Payment will be collected upon order confirmation.
          </p>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-5 bg-rose/30 border-l-4 border-crimson"
          >
            <p className="font-sans text-sm text-charcoal/90">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl text-charcoal font-light mb-2 tracking-tight">
                  Your Selection
                </h2>
                <p className="font-sans text-sm text-charcoal/60 tracking-wide">
                  Review and adjust quantities
                </p>
              </div>

              {items.length === 0 ? (
                <div className="py-20 text-center border border-charcoal/10">
                  <p className="font-sans text-sm text-charcoal/60 mb-6 tracking-wide">
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => router.push('/menu')}
                    className="px-8 py-3 bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors duration-300"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.menu_item_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative border border-charcoal/10 p-6 hover:border-crimson/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="font-serif text-xl text-charcoal font-light mb-1">
                            {item.name}
                          </h3>
                          <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">
                            Rs. {item.price.toFixed(2)} each
                          </p>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3 border border-charcoal/20 px-4 py-2">
                            <button
                              onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                              className="font-sans text-lg text-charcoal/60 hover:text-crimson transition-colors w-6 text-center"
                            >
                              −
                            </button>
                            <span className="font-serif text-lg w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                              className="font-sans text-lg text-charcoal/60 hover:text-crimson transition-colors w-6 text-center"
                            >
                              +
                            </button>
                          </div>

                          <div className="w-28 text-right">
                            <p className="font-serif text-2xl text-crimson font-light">
                              {(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(item.menu_item_id)}
                            className="text-charcoal/30 hover:text-crimson transition-colors ml-2"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="border-t-2 border-charcoal pt-6 mt-8">
                    <div className="flex justify-between items-baseline">
                      <span className="font-serif text-2xl text-charcoal font-light tracking-tight">
                        Total
                      </span>
                      <span className="font-serif text-4xl text-crimson font-light">
                        Rs. {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl text-charcoal font-light mb-2 tracking-tight">
                  Delivery Date
                </h2>
                <p className="font-sans text-sm text-charcoal/60 tracking-wide">
                  When would you like to receive your order?
                </p>
              </div>

              <div className="max-w-md">
                <label className="block mb-3 font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">
                  Select Date
                </label>
                <DatePicker
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  minDate={getMinDate()}
                  maxDate={getMaxDate()}
                />
                <p className="mt-4 font-sans text-xs text-charcoal/50 leading-relaxed">
                  Orders require a minimum of 3 days advance notice. We'll confirm availability within 24 hours.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl text-charcoal font-light mb-2 tracking-tight">
                  Contact Details
                </h2>
                <p className="font-sans text-sm text-charcoal/60 tracking-wide">
                  How should we reach you?
                </p>
              </div>

              <div className="max-w-md space-y-8">
                <div>
                  <label className="block mb-3 font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => {
                      setTouched({ ...touched, name: true });
                      setNameError(validateName(customerName));
                    }}
                    placeholder="Enter your name"
                    className={`w-full px-0 py-4 border-b ${nameError && touched.name ? 'border-crimson' : 'border-charcoal/20'} font-serif text-xl text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-crimson transition-colors bg-transparent`}
                  />
                  {nameError && touched.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 font-sans text-xs text-crimson"
                    >
                      {nameError}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => {
                      setTouched({ ...touched, email: true });
                      setEmailError(validateEmail(customerEmail));
                    }}
                    placeholder="your.email@example.com"
                    className={`w-full px-0 py-4 border-b ${emailError && touched.email ? 'border-crimson' : 'border-charcoal/20'} font-serif text-xl text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-crimson transition-colors bg-transparent`}
                  />
                  {emailError && touched.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 font-sans text-xs text-crimson"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">
                    Phone Number
                  </label>
                  <div className={`flex items-center gap-4 border-b ${phoneError && touched.phone ? 'border-crimson' : 'border-charcoal/20'} pb-4 focus-within:border-crimson transition-colors`}>
                    <span className="font-serif text-xl text-charcoal/60">+91</span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={() => {
                        setTouched({ ...touched, phone: true });
                        setPhoneError(validatePhone(customerPhone));
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                      className="flex-1 font-serif text-xl text-charcoal placeholder:text-charcoal/30 focus:outline-none bg-transparent"
                    />
                  </div>
                  {phoneError && touched.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 font-sans text-xs text-crimson"
                    >
                      {phoneError}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Dietary requirements, customization requests, or delivery notes..."
                    rows={4}
                    className="w-full p-4 border border-charcoal/10 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-crimson transition-colors bg-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-4xl text-charcoal font-light mb-2 tracking-tight">
                  Order Summary
                </h2>
                <p className="font-sans text-sm text-charcoal/60 tracking-wide">
                  Please review before submitting
                </p>
              </div>

              <div className="grid gap-6">
                {/* Items */}
                <div className="border border-charcoal/10 p-8">
                  <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-6">
                    Items Ordered
                  </h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.menu_item_id} className="flex justify-between items-baseline border-b border-charcoal/5 pb-3">
                        <div>
                          <p className="font-serif text-lg text-charcoal">{item.name}</p>
                          <p className="font-sans text-xs text-charcoal/50">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-serif text-lg text-crimson">
                          Rs. {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <div className="flex justify-between items-baseline pt-4 border-t-2 border-charcoal">
                      <span className="font-serif text-xl text-charcoal">Total</span>
                      <span className="font-serif text-3xl text-crimson">Rs. {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="border border-charcoal/10 p-8">
                  <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-4">
                    Delivery Date
                  </h3>
                  <p className="font-serif text-2xl text-charcoal font-light">
                    {deliveryDate ? deliveryDate.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'Not selected'}
                  </p>
                </div>

                {/* Contact */}
                <div className="border border-charcoal/10 p-8">
                  <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-3 font-sans text-sm text-charcoal/80">
                    <div>
                      <span className="text-charcoal/50 uppercase tracking-wider text-xs block mb-1">Name</span>
                      <span className="font-serif text-lg">{customerName}</span>
                    </div>
                    <div>
                      <span className="text-charcoal/50 uppercase tracking-wider text-xs block mb-1">Email</span>
                      <span className="font-serif text-lg">{customerEmail}</span>
                    </div>
                    <div>
                      <span className="text-charcoal/50 uppercase tracking-wider text-xs block mb-1">Phone</span>
                      <span className="font-serif text-lg">+91 {customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {specialInstructions && (
                  <div className="bg-rose/10 border border-crimson/20 p-8">
                    <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-4">
                      Special Instructions
                    </h3>
                    <p className="font-sans text-sm text-charcoal/80 leading-relaxed whitespace-pre-wrap">
                      {specialInstructions}
                    </p>
                  </div>
                )}

                {/* Payment Confirmation Notice */}
                <div className="border-2 border-crimson/30 p-8 bg-gradient-to-br from-rose/10 to-pearl">
                  <div className="flex items-start gap-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B0000" strokeWidth="1.5" className="flex-shrink-0">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <p className="font-serif text-lg text-charcoal mb-2 font-light">
                        Confirmation Only — No Payment Required
                      </p>
                      <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                        By submitting this order, you're requesting confirmation of availability.
                        Payment will be collected upon order confirmation. We'll email you within 24 hours to confirm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-charcoal/10">
        {step > 1 ? (
          <button
            onClick={handleBack}
            disabled={loading}
            className="px-8 py-4 border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-[0.2em] hover:border-charcoal transition-colors duration-300 disabled:opacity-30"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={items.length === 0}
            className="px-10 py-4 bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-4 bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors duration-300 disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-pearl/30 border-t-pearl rounded-full animate-spin" />
                Submitting
              </>
            ) : (
              'Submit Order'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
