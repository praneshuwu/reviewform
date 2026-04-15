'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Order } from '@/lib/types';

interface OrdersTabProps {
  password: string;
}

export default function OrdersTab({ password }: OrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (order: Order) => {
    if (!confirm(`Confirm order #${order.id.slice(0, 8)}?`)) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/orders/confirm/${order.confirmation_token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to confirm order');
      }

      fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to confirm order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;

    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      alert('Please provide a reason (minimum 10 characters)');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/orders/reject/${selectedOrder.confirmation_token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ rejection_reason: rejectionReason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject order');
      }

      fetchOrders();
      setSelectedOrder(null);
      setRejectionReason('');
      setRejecting(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject order');
    } finally {
      setActionLoading(false);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    totalRevenue: orders
      .filter((o) => o.status === 'confirmed')
      .reduce((sum, o) => sum + o.total_amount, 0),
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
            Total Orders
          </p>
          <p className="font-serif text-4xl text-charcoal font-light">{stats.total}</p>
        </div>

        <div className="bg-pearl/90 backdrop-blur-sm p-6 shadow-md">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
            Pending
          </p>
          <p className="font-serif text-4xl text-crimson font-light">{stats.pending}</p>
        </div>

        <div className="bg-pearl/90 backdrop-blur-sm p-6 shadow-md">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
            Confirmed
          </p>
          <p className="font-serif text-4xl text-charcoal font-light">{stats.confirmed}</p>
        </div>

        <div className="bg-pearl/90 backdrop-blur-sm p-6 shadow-md">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
            Revenue
          </p>
          <p className="font-serif text-4xl text-charcoal font-light">
            ₹{stats.totalRevenue.toFixed(0)}
          </p>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] border transition-colors ${
                statusFilter === status
                  ? 'bg-crimson text-pearl border-crimson'
                  : 'text-charcoal/60 border-charcoal/20 hover:border-crimson/40'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-rose/20 border-l-4 border-crimson">
          <p className="font-sans text-sm text-charcoal">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60">
            Loading orders
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-20 border border-charcoal/10">
          <p className="font-sans text-sm text-charcoal/60 tracking-wide">No orders found</p>
        </div>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const deliveryDate = new Date(order.delivery_date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            const statusColors = {
              pending: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900' },
              confirmed: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900' },
              rejected: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700' },
              cancelled: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700' },
            };

            const colors = statusColors[order.status as keyof typeof statusColors];

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-pearl/90 backdrop-blur-sm border border-charcoal/10 p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-serif text-2xl text-charcoal font-light">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <span
                        className={`px-3 py-1 ${colors.bg} ${colors.border} ${colors.text} font-sans text-xs uppercase tracking-wider border rounded-full`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-charcoal/60 tracking-wide">
                      {order.customer_name} · {order.customer_email}
                    </p>
                    <p className="font-sans text-xs text-charcoal/50 mt-1">
                      {order.customer_phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-serif text-3xl text-crimson font-light mb-1">
                      ₹{order.total_amount.toFixed(2)}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/50">
                      {deliveryDate}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6 p-4 bg-charcoal/[0.02] border border-charcoal/5">
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-3">
                    Items
                  </p>
                  <div className="space-y-2">
                    {order.order_items.map((item, index) => (
                      <p key={index} className="font-sans text-sm text-charcoal/80">
                        {item.name} × {item.quantity} — ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {order.special_instructions && (
                  <div className="mb-6 p-4 bg-rose/10 border border-crimson/20">
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
                      Special Instructions
                    </p>
                    <p className="font-sans text-sm text-charcoal/80 leading-relaxed">
                      {order.special_instructions}
                    </p>
                  </div>
                )}

                {/* Rejection Reason */}
                {order.status === 'rejected' && order.rejection_reason && (
                  <div className="mb-6 p-4 border border-charcoal/10">
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 mb-2">
                      Rejection Reason
                    </p>
                    <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                      {order.rejection_reason}
                    </p>
                  </div>
                )}

                {/* Confirmed Timestamp */}
                {order.status === 'confirmed' && order.confirmed_at && (
                  <div className="pt-4 border-t border-charcoal/10">
                    <p className="font-sans text-xs text-charcoal/50 tracking-wide">
                      Confirmed on{' '}
                      {new Date(order.confirmed_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}

                {/* Actions for Pending Orders */}
                {order.status === 'pending' && (
                  <div className="flex gap-3 pt-6 border-t border-charcoal/10">
                    <button
                      onClick={() => handleConfirm(order)}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors duration-300 disabled:opacity-50"
                    >
                      Confirm Order
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setRejecting(true);
                      }}
                      disabled={actionLoading}
                      className="flex-1 py-3 border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-[0.2em] hover:border-charcoal transition-colors duration-300 disabled:opacity-50"
                    >
                      Reject Order
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Rejection Modal */}
      <AnimatePresence>
        {rejecting && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!actionLoading) {
                setRejecting(false);
                setSelectedOrder(null);
                setRejectionReason('');
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-pearl max-w-lg w-full p-10 shadow-2xl"
            >
              <h3 className="font-serif text-3xl text-charcoal font-light mb-6 tracking-tight">
                Reject Order
              </h3>

              <p className="font-sans text-sm text-charcoal/60 mb-6 leading-relaxed">
                Order #{selectedOrder.id.slice(0, 8).toUpperCase()} — Please provide a reason for
                the customer. This will be sent via email.
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Unfortunately, we are fully booked for this date..."
                rows={4}
                disabled={actionLoading}
                className="w-full px-0 py-3 border-b border-charcoal/20 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-crimson transition-colors bg-transparent resize-none mb-8 disabled:opacity-50"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setRejecting(false);
                    setSelectedOrder(null);
                    setRejectionReason('');
                  }}
                  disabled={actionLoading}
                  className="flex-1 py-3 border border-charcoal/20 text-charcoal font-sans text-xs uppercase tracking-[0.2em] hover:border-charcoal transition-colors duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || rejectionReason.trim().length < 10 || actionLoading}
                  className="flex-1 py-3 bg-crimson text-pearl font-sans text-xs uppercase tracking-[0.2em] hover:bg-charcoal transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Rejecting...' : 'Reject Order'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
