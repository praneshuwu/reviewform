import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { MenuCategory, MenuItem, MenuCategoryWithItems } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [categoriesResult, itemsResult] = await Promise.all([
      supabase
        .from('menu_categories')
        .select('*')
        .order('display_order', { ascending: true }),
      supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true }),
    ]);

    if (categoriesResult.error) {
      console.error('Categories error:', categoriesResult.error);
      return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }

    if (itemsResult.error) {
      console.error('Items error:', itemsResult.error);
      return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }

    const categories = categoriesResult.data as MenuCategory[];
    const items = itemsResult.data as MenuItem[];

    // Group items under their categories
    const menuWithItems: MenuCategoryWithItems[] = categories
      .map((category) => ({
        ...category,
        items: items.filter((item) => item.category_id === category.id),
      }))
      .filter((category) => category.items.length > 0);

    return NextResponse.json({ categories: menuWithItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}
