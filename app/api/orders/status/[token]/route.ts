import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { OrderStatusResponse } from '@/lib/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    // Fetch order by confirmation token
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('confirmation_token', token)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch status history
    const { data: statusHistory } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', order.id)
      .order('created_at', { ascending: true });

    const response: OrderStatusResponse = {
      success: true,
      order: {
        ...order,
        status_history: statusHistory || [],
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Order status fetch error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
