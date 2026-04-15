import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';
import { Order, OrderItem } from '@/lib/types';

interface AdminOrderNotificationProps {
  order: Order;
  confirmUrl: string;
  rejectUrl: string;
  dashboardUrl: string;
}

export function AdminOrderNotification({
  order,
  confirmUrl,
  rejectUrl,
  dashboardUrl,
}: AdminOrderNotificationProps) {
  const deliveryDate = new Date(order.delivery_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Html>
      <Head />
      <Preview>New Order #{order.id.slice(0, 8)} - {order.customer_name} - Delivery: {deliveryDate}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Order Received! 🎂</Heading>

          <Section style={orderHeader}>
            <Text style={orderNumber}>Order #{order.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={orderTime}>Placed on {orderDate}</Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>Customer Information</Heading>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={tableLabel}>Name:</td>
                  <td style={tableValue}>{order.customer_name}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Email:</td>
                  <td style={tableValue}>{order.customer_email}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Phone:</td>
                  <td style={tableValue}>{order.customer_phone}</td>
                </tr>
                <tr>
                  <td style={tableLabel}>Delivery Date:</td>
                  <td style={{...tableValue, fontWeight: '600', color: '#8B0000'}}>{deliveryDate}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>Order Items</Heading>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E5E5' }}>
                  <th style={tableHeader}>Item</th>
                  <th style={{ ...tableHeader, textAlign: 'center' }}>Qty</th>
                  <th style={{ ...tableHeader, textAlign: 'right' }}>Price</th>
                  <th style={{ ...tableHeader, textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item: OrderItem, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={itemName}>{item.name}</td>
                    <td style={{ ...itemQty, textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ ...itemPrice, textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                    <td style={{ ...itemPrice, textAlign: 'right' }}>
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ ...totalLabel, textAlign: 'right', paddingTop: '12px' }}>
                    Total Amount:
                  </td>
                  <td style={{ ...totalValue, textAlign: 'right', paddingTop: '12px' }}>
                    ₹{order.total_amount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </Section>

          {order.special_instructions && (
            <>
              <Hr style={hr} />
              <Section>
                <Heading as="h2" style={h2}>Special Instructions</Heading>
                <Text style={instructions}>{order.special_instructions}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section style={actionSection}>
            <Heading as="h2" style={h2}>Quick Actions</Heading>
            <Row style={{ marginTop: '24px' }}>
              <Column style={{ paddingRight: '8px' }}>
                <Button href={confirmUrl} style={confirmButton}>
                  ✓ Confirm Order
                </Button>
              </Column>
              <Column style={{ paddingLeft: '8px' }}>
                <Button href={rejectUrl} style={rejectButton}>
                  ✗ Reject Order
                </Button>
              </Column>
            </Row>

            <Text style={orText}>Or view in dashboard:</Text>
            <Button href={dashboardUrl} style={dashboardButton}>
              Open Admin Dashboard
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This is an automated notification from Kinchana's Bakery order system.
            <br />
            Order ID: {order.id}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#FEFEFE',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  border: '1px solid #E5E5E5',
  borderRadius: '8px',
};

const h1 = {
  color: '#8B0000',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#2C2C2C',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const orderHeader = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const orderNumber = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#2C2C2C',
  margin: '0 0 4px',
};

const orderTime = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
};

const hr = {
  borderColor: '#E5E5E5',
  margin: '24px 0',
};

const table = {
  width: '100%',
  marginTop: '12px',
};

const tableLabel = {
  color: '#666666',
  fontSize: '14px',
  padding: '8px 12px 8px 0',
  verticalAlign: 'top',
  width: '140px',
};

const tableValue = {
  color: '#2C2C2C',
  fontSize: '14px',
  padding: '8px 0',
  verticalAlign: 'top',
};

const tableHeader = {
  color: '#666666',
  fontSize: '13px',
  fontWeight: '600',
  padding: '12px 8px',
  textAlign: 'left' as const,
};

const itemName = {
  color: '#2C2C2C',
  fontSize: '14px',
  padding: '12px 8px',
};

const itemQty = {
  color: '#666666',
  fontSize: '14px',
  padding: '12px 8px',
};

const itemPrice = {
  color: '#2C2C2C',
  fontSize: '14px',
  padding: '12px 8px',
};

const totalLabel = {
  color: '#2C2C2C',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 8px',
};

const totalValue = {
  color: '#8B0000',
  fontSize: '18px',
  fontWeight: '700',
  padding: '12px 8px',
};

const instructions = {
  backgroundColor: '#FFF9F0',
  border: '1px solid #FFE4E1',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  color: '#2C2C2C',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
};

const actionSection = {
  marginTop: '32px',
};

const confirmButton = {
  backgroundColor: '#8B0000',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  width: '100%',
};

const rejectButton = {
  backgroundColor: '#666666',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  width: '100%',
};

const orText = {
  textAlign: 'center' as const,
  color: '#666666',
  fontSize: '14px',
  margin: '24px 0 12px',
};

const dashboardButton = {
  backgroundColor: '#ffffff',
  border: '1px solid #8B0000',
  borderRadius: '6px',
  color: '#8B0000',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  width: '100%',
};

const footer = {
  color: '#999999',
  fontSize: '12px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  marginTop: '24px',
};

export default AdminOrderNotification;
