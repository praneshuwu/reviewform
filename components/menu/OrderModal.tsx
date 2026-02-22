'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MenuItem } from '@/lib/types';

const WHATSAPP_NUMBER = '919080370407';
const INSTAGRAM_USERNAME = 'madebykinchanas';

interface OrderModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function OrderModal({ item, onClose }: OrderModalProps) {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [copied, setCopied] = useState(false);

  const formatPrice = (price: number) => {
    const rounded = Math.round(price);
    return rounded === price ? `Rs. ${rounded}` : `Rs. ${price.toFixed(2)}`;
  };

  const templateMessage = `Hi Kinchana's! I'd like to place an order:\n\nItem: ${item.name}\nPrice: ${formatPrice(item.price)}${additionalInfo.trim() ? `\n\nAdditional details: ${additionalInfo.trim()}` : ''}\n\nPlease let me know the next steps!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(templateMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = templateMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(templateMessage);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  const handleInstagram = () => {
    window.open(`https://ig.me/m/${INSTAGRAM_USERNAME}`, '_blank');
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="relative w-full max-w-md bg-pearl shadow-xl z-10"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-charcoal/40 hover:text-crimson transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-2">
              Place an Order
            </p>
            <h3 className="font-serif text-2xl text-charcoal font-light">
              {item.name}
            </h3>
            <p className="font-serif text-lg text-crimson mt-1">
              {formatPrice(item.price)}
            </p>
          </div>

          {/* Template message preview */}
          <div className="bg-charcoal/[0.03] border border-charcoal/10 p-4 mb-4">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-2">
              Message Preview
            </p>
            <p className="font-sans text-sm text-charcoal/80 whitespace-pre-line leading-relaxed">
              {templateMessage}
            </p>
          </div>

          {/* Additional info input */}
          <div className="mb-6">
            <label className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 block mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Quantity, delivery date, special requests..."
              rows={2}
              className="w-full px-3 py-3 border border-charcoal/20 font-sans text-sm text-charcoal focus:outline-none focus:border-crimson transition-all bg-transparent resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* WhatsApp */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white font-sans text-sm uppercase tracking-[0.15em] hover:brightness-95 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order on WhatsApp
            </motion.button>

            {/* Instagram */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleInstagram}
              className="w-full flex items-center justify-center gap-3 py-4 text-white font-sans text-sm uppercase tracking-[0.15em] hover:brightness-95 transition-all"
              style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Message on Instagram
            </motion.button>

            {/* Copy message */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-3 py-4 border border-charcoal/20 text-charcoal font-sans text-sm uppercase tracking-[0.15em] hover:border-crimson transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {copied ? 'Copied!' : 'Copy Message'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
