import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Indian phone number validation
const phoneRegex = /^\+91-\d{4}-\d{6}$/;

const reviewSchema = z.object({
  name: z.string().max(100).optional().default('Anonymous'),
  phone: z.string()
    .regex(phoneRegex, 'Invalid Indian phone number format')
    .optional()
    .or(z.literal(''))
    .default(''),
  item: z.string().min(1).max(50),
  rating: z.number().min(1).max(5),
  wouldOrderAgain: z.string().min(1).max(50),
  favorite: z.string().max(500),
  improvements: z.string().max(500),
  feedback: z.string().max(2000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // Map camelCase to snake_case for database
    const { error } = await supabase.from('reviews').insert([
      {
        name: validatedData.name,
        phone: validatedData.phone,
        item: validatedData.item,
        rating: validatedData.rating,
        would_order_again: validatedData.wouldOrderAgain,
        favorite: validatedData.favorite,
        improvements: validatedData.improvements,
        feedback: validatedData.feedback,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
