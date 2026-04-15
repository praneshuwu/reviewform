import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/client';
import { CustomerOrderConfirmed } from '@/lib/email/templates/CustomerOrderConfirmed';
import type { Order } from '@/lib/types';
import * as React from 'react';

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
      return NextResponse.redirect(
        new URL('/order/error?message=Order not found', request.url)
      );
    }

    // Check if already confirmed
    if (order.status === 'confirmed') {
      return NextResponse.redirect(
        new URL(`/order/status/${token}?message=already_confirmed`, request.url)
      );
    }

    // Check if already rejected
    if (order.status === 'rejected') {
      return NextResponse.redirect(
        new URL(`/order/status/${token}?message=already_rejected`, request.url)
      );
    }

    // Update order status to confirmed
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmed_by: 'admin',
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Order update error:', updateError);
      return NextResponse.redirect(
        new URL('/order/error?message=Failed to confirm order', request.url)
      );
    }

    // Log status history
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      old_status: 'pending',
      new_status: 'confirmed',
      changed_by: 'admin',
      notes: 'Order confirmed via email link',
    });

    // Fetch updated order
    const { data: updatedOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order.id)
      .single();

    // Send customer confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const statusUrl = `${baseUrl}/order/status/${token}`;
    const whatsappUrl = `https://wa.me/919080370407?text=Hi, I have a question about order %23${order.id.slice(0, 8)}`;

    try {
      await sendEmail({
        to: order.customer_email,
        subject: `Order Confirmed! - Kinchana's Bakery`,
        react: React.createElement(CustomerOrderConfirmed, {
          order: updatedOrder || order,
          statusUrl,
          whatsappUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the confirmation if email fails
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/order/status/${token}?message=confirmed`, request.url)
    );
  } catch (error) {
    console.error('Order confirmation error:', error);
    return NextResponse.redirect(
      new URL('/order/error?message=An unexpected error occurred', request.url)
    );
  }
}

// Support POST for programmatic confirmation (from admin dashboard)
export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  return GET(request, { params });
}
