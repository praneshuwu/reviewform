'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Order, OrderStatusHistory } from '@/lib/types';

export default function OrderStatusPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order & { status_history?: OrderStatusHistory[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderStatus();
  }, [params.token]);

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`/api/orders/status/${params.token}`);

      if (!response.ok) {
        throw new Error('Order not found');
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-2 border-crimson border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">Loading</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center border border-charcoal/10 p-12"
        >
          <div className="text-6xl mb-6 opacity-40">✕</div>
          <h1 className="font-serif text-3xl text-charcoal font-light mb-4">
            Order Not Found
          </h1>
          <p className="font-sans text-sm text-charcoal/60 mb-8 tracking-wide">{error}</p>
          <button
            onClick={() => router.push('/menu')}
            className="px-8 py-4 bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors duration-300"
          >
            Return to Menu
          </button>
        </motion.div>
      </div>
    );
  }

  const deliveryDate = new Date(order.delivery_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusConfig = {
    pending: {
      icon: '○',
      accent: '#D4A574',
      title: 'Awaiting Confirmation',
      message: "We're reviewing your order and will confirm availability soon.",
    },
    confirmed: {
      icon: '✓',
      accent: '#8B0000',
      title: 'Order Confirmed',
      message: "Your order is confirmed! We'll prepare it fresh for your delivery date.",
    },
    rejected: {
      icon: '✕',
      accent: '#999',
      title: 'Order Unavailable',
      message: "Unfortunately, we couldn't fulfill this order.",
    },
    cancelled: {
      icon: '—',
      accent: '#666',
      title: 'Order Cancelled',
      message: 'This order has been cancelled.',
    },
  };

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-pearl py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.push('/menu')}
            className="group flex items-center gap-2 text-charcoal/60 hover:text-crimson transition-colors duration-300 mb-8"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-sans text-xs uppercase tracking-[0.2em]">Menu</span>
          </button>

          <div className="flex items-baseline gap-6">
            <h1 className="font-serif text-5xl text-charcoal font-light tracking-tight">
              Order Status
            </h1>
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/40">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12 border-2 p-10 relative overflow-hidden"
          style={{ borderColor: currentStatus.accent + '40' }}
        >
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: currentStatus.accent }} />
          <div className="flex items-start gap-6">
            <div
              className="text-5xl font-light opacity-60"
              style={{ color: currentStatus.accent }}
            >
              {currentStatus.icon}
            </div>
            <div className="flex-1">
              <h2
                className="font-serif text-3xl font-light mb-2 tracking-tight"
                style={{ color: currentStatus.accent }}
              >
                {currentStatus.title}
              </h2>
              <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                {currentStatus.message}
              </p>
              {order.status === 'rejected' && order.rejection_reason && (
                <div className="mt-6 pt-6 border-t border-charcoal/10">
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-2">
                    Reason
                  </p>
                  <p className="font-sans text-sm text-charcoal/80 leading-relaxed">
                    {order.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Order Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Delivery Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-charcoal/10 p-8"
          >
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-6">
              Delivery Date
            </h3>
            <p className="font-serif text-2xl text-crimson font-light tracking-tight">
              {deliveryDate}
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-charcoal/10 p-8"
          >
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-6">
              Contact Information
            </h3>
            <div className="space-y-2 font-sans text-sm text-charcoal/70">
              <p className="font-serif text-lg">{order.customer_name}</p>
              <p className="text-charcoal/50">{order.customer_email}</p>
              <p className="text-charcoal/50">{order.customer_phone}</p>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-charcoal/10 p-10 mb-6"
        >
          <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-8">
            Order Items
          </h3>
          <div className="space-y-6">
            {order.order_items.map((item, index) => (
              <div
                key={index}
                className="flex items-baseline justify-between pb-6 border-b border-charcoal/5 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-serif text-xl text-charcoal font-light mb-1">
                    {item.name}
                  </p>
                  <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">
                    Rs. {item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-serif text-2xl text-crimson font-light">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="pt-6 border-t-2 border-charcoal flex items-baseline justify-between">
              <span className="font-serif text-2xl text-charcoal font-light">Total</span>
              <span className="font-serif text-4xl text-crimson font-light">
                Rs. {order.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Special Instructions */}
        {order.special_instructions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-rose/10 border border-crimson/20 p-10 mb-12"
          >
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-4">
              Special Instructions
            </h3>
            <p className="font-sans text-sm text-charcoal/80 leading-relaxed whitespace-pre-wrap">
              {order.special_instructions}
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-12 border-t border-charcoal/10"
        >
          {order.status === 'rejected' && (
            <button
              onClick={() => router.push('/order')}
              className="px-10 py-4 bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors duration-300"
            >
              Place New Order
            </button>
          )}
          <a
            href={`https://wa.me/919080370407?text=Hi, I have a question about order %23${order.id.slice(0, 8)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-[0.2em] hover:border-charcoal transition-colors duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
}
