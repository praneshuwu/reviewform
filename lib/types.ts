export interface Review {
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

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  dietary_tags: DietaryTag[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

export const DIETARY_TAGS = [
  'vegan',
  'vegetarian',
  'gluten-free',
  'nut-free',
  'dairy-free',
  'eggless',
] as const;

export type DietaryTag = (typeof DIETARY_TAGS)[number];

// ============================================
// Order Management Types
// ============================================

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'rejected',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_date: string; // ISO date string
  order_items: OrderItem[];
  total_amount: number;
  special_instructions: string;
  status: OrderStatus;
  confirmation_token: string;
  confirmed_at: string | null;
  confirmed_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface OrderWithHistory extends Order {
  status_history: OrderStatusHistory[];
}

// API Request/Response types
export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_date: string;
  order_items: OrderItem[];
  special_instructions?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
  confirmation_token: string;
  message: string;
}

export interface OrderStatusResponse {
  success: boolean;
  order: Order;
}
