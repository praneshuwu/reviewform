import { z } from 'zod';

// ============================================
// Order Validation Schemas
// ============================================

export const orderItemSchema = z.object({
  menu_item_id: z.string().uuid('Invalid menu item ID'),
  name: z.string().min(1, 'Item name is required').max(200),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Quantity too large'),
  price: z.number().min(0, 'Price must be non-negative'),
});

export const createOrderSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s\.]+$/, 'Name should only contain letters and spaces'),

  customer_email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .toLowerCase(),

  customer_phone: z
    .string()
    .regex(/^\+91-\d{10}$/, 'Phone must be in format: +91-XXXXXXXXXX')
    .or(z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'))
    .transform((val) => {
      // Transform 10-digit number to +91-XXXXXXXXXX format
      if (val.match(/^\d{10}$/)) {
        return `+91-${val}`;
      }
      return val;
    }),

  delivery_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const deliveryDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const minDaysAhead = parseInt(process.env.MIN_ORDER_DAYS_AHEAD || '3', 10);
      const minDate = new Date(today);
      minDate.setDate(minDate.getDate() + minDaysAhead);

      return deliveryDate >= minDate;
    }, {
      message: `Delivery date must be at least ${process.env.MIN_ORDER_DAYS_AHEAD || 3} days from today`,
    }),

  order_items: z
    .array(orderItemSchema)
    .min(1, 'At least one item is required')
    .max(50, 'Too many items in order'),

  special_instructions: z
    .string()
    .max(1000, 'Special instructions too long')
    .optional()
    .default(''),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;

// ============================================
// Order Confirmation/Rejection Schemas
// ============================================

export const confirmOrderSchema = z.object({
  confirmation_token: z.string().uuid('Invalid confirmation token'),
});

export const rejectOrderSchema = z.object({
  confirmation_token: z.string().uuid('Invalid confirmation token'),
  rejection_reason: z
    .string()
    .min(10, 'Please provide a reason (minimum 10 characters)')
    .max(500, 'Rejection reason too long'),
});

// ============================================
// Admin Order Query Schemas
// ============================================

export const orderQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'rejected', 'cancelled', 'all']).optional(),
  delivery_date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  delivery_date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  customer_email: z.string().email().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
