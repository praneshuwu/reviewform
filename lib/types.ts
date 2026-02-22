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
