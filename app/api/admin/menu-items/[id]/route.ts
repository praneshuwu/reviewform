import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { verifyAdminAuth } from '@/lib/auth';
import { DIETARY_TAGS } from '@/lib/types';

const updateMenuItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().min(0).optional(),
  category_id: z.string().uuid().optional(),
  is_available: z.boolean().optional(),
  dietary_tags: z.array(z.enum(DIETARY_TAGS)).optional(),
  image_url: z.string().optional(),
  display_order: z.number().int().min(0).optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateMenuItemSchema.parse(body);

    const { data, error } = await supabase
      .from('menu_items')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the item first to get image_url for cleanup
    const { data: item } = await supabase
      .from('menu_items')
      .select('image_url')
      .eq('id', params.id)
      .single();

    // Delete the image from storage if it exists
    if (item?.image_url) {
      const fileName = item.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('menu-images').remove([fileName]);
      }
    }

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
