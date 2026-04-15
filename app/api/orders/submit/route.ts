import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createOrderSchema } from '@/lib/validations';
import { sendEmail } from '@/lib/email/client';
import { AdminOrderNotification } from '@/lib/email/templates/AdminOrderNotification';
import { CustomerOrderReceived } from '@/lib/email/templates/CustomerOrderReceived';
import type { CreateOrderRequest, CreateOrderResponse } from '@/lib/types';
import * as React from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body: CreateOrderRequest = await request.json();
    console.log('Received order request:', JSON.stringify(body, null, 2));

    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error.format());
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Verify menu items exist and are available
    const menuItemIds = validatedData.order_items.map((item) => item.menu_item_id);
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, name, price, is_available')
      .in('id', menuItemIds);

    if (menuError) {
      console.error('Menu items fetch error:', menuError);
      return NextResponse.json(
        { error: 'Failed to verify menu items' },
        { status: 500 }
      );
    }

    // Check if all items are available
    const unavailableItems = menuItems?.filter((item) => !item.is_available) || [];
    if (unavailableItems.length > 0) {
      return NextResponse.json(
        {
          error: 'Some items are no longer available',
          unavailableItems: unavailableItems.map((item) => item.name),
        },
        { status: 400 }
      );
    }

    // Verify prices match (prevent price manipulation)
    const priceMap = new Map(menuItems?.map((item) => [item.id, item.price]) || []);
    for (const orderItem of validatedData.order_items) {
      const actualPrice = priceMap.get(orderItem.menu_item_id);
      if (actualPrice === undefined) {
        return NextResponse.json(
          { error: `Menu item ${orderItem.name} not found` },
          { status: 400 }
        );
      }
      if (Math.abs(actualPrice - orderItem.price) > 0.01) {
        return NextResponse.json(
          { error: 'Price mismatch detected. Please refresh and try again.' },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const calculatedTotal = validatedData.order_items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Insert order into database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: validatedData.customer_name,
        customer_email: validatedData.customer_email,
        customer_phone: validatedData.customer_phone,
        delivery_date: validatedData.delivery_date,
        order_items: validatedData.order_items,
        total_amount: calculatedTotal,
        special_instructions: validatedData.special_instructions || '',
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Log status history
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      old_status: null,
      new_status: 'pending',
      changed_by: 'system',
      notes: 'Order created',
    });

    // Prepare URLs for emails
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/api/orders/confirm/${order.confirmation_token}`;
    const rejectUrl = `${baseUrl}/api/orders/reject/${order.confirmation_token}`;
    const statusUrl = `${baseUrl}/order/status/${order.confirmation_token}`;
    const dashboardUrl = `${baseUrl}/admin`;
    const whatsappUrl = `https://wa.me/919080370407?text=Hi, I have a question about order %23${order.id.slice(0, 8)}`;

    // Send admin notification email
    const adminNotificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'kinchanas.bakery@gmail.com';
    try {
      await sendEmail({
        to: adminNotificationEmail,
        subject: `New Order #${order.id.slice(0, 8)} - ${validatedData.customer_name}`,
        react: React.createElement(AdminOrderNotification, {
          order,
          confirmUrl,
          rejectUrl,
          dashboardUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the order if email fails
    }

    // Send customer confirmation email
    try {
      await sendEmail({
        to: validatedData.customer_email,
        subject: `Order Received - Kinchana's Bakery`,
        react: React.createElement(CustomerOrderReceived, {
          order,
          statusUrl,
          whatsappUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send customer email:', emailError);
      // Don't fail the order if email fails
    }

    // Return success response
    const response: CreateOrderResponse = {
      success: true,
      order_id: order.id,
      confirmation_token: order.confirmation_token,
      message: 'Order submitted successfully! We will confirm within 24 hours.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Order submission error:', error);

    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
