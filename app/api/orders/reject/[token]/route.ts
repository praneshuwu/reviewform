import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/client';
import { CustomerOrderRejected } from '@/lib/email/templates/CustomerOrderRejected';
import * as React from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  const url = new URL(request.url);
  const reason = url.searchParams.get('reason');

  // If no reason provided, redirect to admin dashboard with modal to enter reason
  if (!reason) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      new URL(`/admin?action=reject&token=${token}`, baseUrl)
    );
  }

  try {
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

    // Check if already rejected
    if (order.status === 'rejected') {
      return NextResponse.redirect(
        new URL(`/order/status/${token}?message=already_rejected`, request.url)
      );
    }

    // Check if already confirmed
    if (order.status === 'confirmed') {
      return NextResponse.redirect(
        new URL(`/order/status/${token}?message=already_confirmed`, request.url)
      );
    }

    // Update order status to rejected
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Order update error:', updateError);
      return NextResponse.redirect(
        new URL('/order/error?message=Failed to reject order', request.url)
      );
    }

    // Log status history
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      old_status: 'pending',
      new_status: 'rejected',
      changed_by: 'admin',
      notes: reason,
    });

    // Send customer rejection email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const whatsappUrl = `https://wa.me/919080370407?text=Hi, regarding my rejected order %23${order.id.slice(0, 8)}`;
    const newOrderUrl = `${baseUrl}/order`;

    try {
      await sendEmail({
        to: order.customer_email,
        subject: `Order Update - Kinchana's Bakery`,
        react: React.createElement(CustomerOrderRejected, {
          order,
          rejectionReason: reason,
          whatsappUrl,
          newOrderUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Don't fail the rejection if email fails
    }

    // Redirect to admin dashboard with success message
    return NextResponse.redirect(
      new URL('/admin?message=order_rejected', baseUrl)
    );
  } catch (error) {
    console.error('Order rejection error:', error);
    return NextResponse.redirect(
      new URL('/order/error?message=An unexpected error occurred', request.url)
    );
  }
}

// Support POST for programmatic rejection (from admin dashboard)
export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const body = await request.json();
    const { rejection_reason } = body;

    if (!rejection_reason || rejection_reason.trim().length < 10) {
      return NextResponse.json(
        { error: 'Rejection reason must be at least 10 characters' },
        { status: 400 }
      );
    }

    const token = params.token;

    // Fetch order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('confirmation_token', token)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check status
    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: `Order is already ${order.status}` },
        { status: 400 }
      );
    }

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'rejected',
        rejection_reason,
      })
      .eq('id', order.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to reject order' },
        { status: 500 }
      );
    }

    // Log status history
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      old_status: 'pending',
      new_status: 'rejected',
      changed_by: 'admin',
      notes: rejection_reason,
    });

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const whatsappUrl = `https://wa.me/919080370407?text=Hi, regarding my rejected order %23${order.id.slice(0, 8)}`;
    const newOrderUrl = `${baseUrl}/order`;

    try {
      await sendEmail({
        to: order.customer_email,
        subject: `Order Update - Kinchana's Bakery`,
        react: CustomerOrderRejected({
          order,
          rejectionReason: rejection_reason,
          whatsappUrl,
          newOrderUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
    }

    return NextResponse.json({ success: true, message: 'Order rejected' });
  } catch (error) {
    console.error('Order rejection error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
