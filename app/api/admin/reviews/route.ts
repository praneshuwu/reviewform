import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  try {
    console.log('Reviews API called');

    // Simple auth check - verify password in Authorization header
    const authHeader = request.headers.get('Authorization');
    const password = authHeader?.replace('Bearer ', '');

    console.log('Auth header present:', authHeader ? 'Yes' : 'No');

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    console.log('ADMIN_PASSWORD exists:', ADMIN_PASSWORD ? 'Yes' : 'No');

    if (!ADMIN_PASSWORD) {
      console.error('❌ ADMIN_PASSWORD not set in reviews API');
      return NextResponse.json(
        { error: 'Server configuration error - ADMIN_PASSWORD not set' },
        { status: 500 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ Auth successful, fetching reviews');

    // Fetch all reviews ordered by newest first
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
