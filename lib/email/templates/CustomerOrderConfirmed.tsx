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
} from '@react-email/components';
import * as React from 'react';
import { Order, OrderItem } from '@/lib/types';

interface CustomerOrderConfirmedProps {
  order: Order;
  statusUrl: string;
  whatsappUrl: string;
}

export function CustomerOrderConfirmed({
  order,
  statusUrl,
  whatsappUrl,
}: CustomerOrderConfirmedProps) {
  const deliveryDate = new Date(order.delivery_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Your order is confirmed! Delivery on {deliveryDate}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Celebration header */}
          <Section style={celebrationBox}>
            <Text style={celebrationIcon}>✨</Text>
            <Heading style={h1}>Your Order is Confirmed!</Heading>
            <Text style={celebrationText}>We can't wait to make your special treats</Text>
          </Section>

          <Text style={greeting}>Dear {order.customer_name},</Text>

          <Text style={paragraph}>
            Great news! Your order has been confirmed and will be freshly prepared
            for you. We'll make sure everything is perfect for your special day.
          </Text>

          <Section style={deliveryBox}>
            <Text style={deliveryIcon}>🎂</Text>
            <Text style={deliveryLabel}>Ready for Pickup/Delivery</Text>
            <Text style={deliveryDateLargeStyle}>{deliveryDate}</Text>
            <Text style={deliveryNote}>
              We'll send you a reminder one day before your delivery date.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>Your Order Details</Heading>
            <Text style={orderIdText}>Order #{order.id.slice(0, 8).toUpperCase()}</Text>

            <table style={table}>
              <thead>
                <tr style={{ borderBottom: '2px solid #FFE4E1' }}>
                  <th style={tableHeader}>Item</th>
                  <th style={{ ...tableHeader, textAlign: 'center' }}>Qty</th>
                  <th style={{ ...tableHeader, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item: OrderItem, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #FFF9F0' }}>
                    <td style={itemName}>{item.name}</td>
                    <td style={{ ...itemQty, textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ ...itemPrice, textAlign: 'right' }}>
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ ...totalLabel, textAlign: 'right', paddingTop: '16px' }}>
                    Total Amount:
                  </td>
                  <td style={{ ...totalValue, textAlign: 'right', paddingTop: '16px' }}>
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
                <Heading as="h2" style={h2}>Your Special Instructions</Heading>
                <Text style={instructions}>{order.special_instructions}</Text>
                <Text style={instructionsNote}>
                  ✓ We've noted your preferences
                </Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>What Happens Next?</Heading>
            <table style={timelineTable}>
              <tbody>
                <tr>
                  <td style={timelineIcon}>📝</td>
                  <td style={timelineText}>
                    <strong>Order Confirmed</strong> - We've received and confirmed your order
                  </td>
                </tr>
                <tr>
                  <td style={timelineIcon}>👨‍🍳</td>
                  <td style={timelineText}>
                    <strong>Preparation</strong> - We'll prepare your order fresh on the delivery day
                  </td>
                </tr>
                <tr>
                  <td style={timelineIcon}>🔔</td>
                  <td style={timelineText}>
                    <strong>Reminder</strong> - You'll receive a reminder 1 day before delivery
                  </td>
                </tr>
                <tr>
                  <td style={timelineIcon}>🎉</td>
                  <td style={timelineText}>
                    <strong>Enjoy!</strong> - Pickup/delivery on {deliveryDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          <Section style={actionSection}>
            <Text style={actionText}>Questions or need to make changes?</Text>
            <Button href={whatsappUrl} style={whatsappButton}>
              📱 Chat with Us on WhatsApp
            </Button>

            <Text style={orText}>or</Text>

            <Button href={statusUrl} style={statusButton}>
              View Order Status
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Thank you for choosing Kinchana's Bakery! ❤️
            <br />
            <span style={{ color: '#999999', fontSize: '12px', display: 'block', marginTop: '8px' }}>
              Order ID: {order.id}
            </span>
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
  padding: '0',
  maxWidth: '600px',
  border: '1px solid #E5E5E5',
  borderRadius: '8px',
  overflow: 'hidden' as const,
};

const celebrationBox = {
  background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
  padding: '40px 20px',
  textAlign: 'center' as const,
};

const celebrationIcon = {
  fontSize: '48px',
  margin: '0 0 16px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const celebrationText = {
  color: '#FFE4E1',
  fontSize: '16px',
  margin: '0',
};

const greeting = {
  fontSize: '16px',
  color: '#2C2C2C',
  margin: '32px 24px 16px',
};

const paragraph = {
  fontSize: '15px',
  color: '#666666',
  lineHeight: '1.6',
  margin: '0 24px 24px',
};

const deliveryBox = {
  backgroundColor: '#FFF9F0',
  border: '2px solid #8B0000',
  borderRadius: '8px',
  padding: '32px 24px',
  textAlign: 'center' as const,
  margin: '24px',
};

const deliveryIcon = {
  fontSize: '40px',
  margin: '0 0 12px',
};

const deliveryLabel = {
  fontSize: '13px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px',
};

const deliveryDateLargeStyle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#8B0000',
  margin: '0 0 16px',
  lineHeight: '1.3',
};

const deliveryNote = {
  fontSize: '13px',
  color: '#666666',
  fontStyle: 'italic' as const,
  margin: '0',
};

const h2 = {
  color: '#2C2C2C',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
  padding: '0 24px',
};

const orderIdText = {
  fontSize: '13px',
  color: '#999999',
  margin: '0 24px 16px',
};

const hr = {
  borderColor: '#E5E5E5',
  margin: '32px 24px',
};

const table = {
  width: 'calc(100% - 48px)',
  margin: '0 24px',
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
  fontSize: '15px',
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
  fontWeight: '500',
};

const totalLabel = {
  color: '#2C2C2C',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 8px',
  borderTop: '2px solid #FFE4E1',
};

const totalValue = {
  color: '#8B0000',
  fontSize: '20px',
  fontWeight: '700',
  padding: '12px 8px',
  borderTop: '2px solid #FFE4E1',
};

const instructions = {
  backgroundColor: '#F9F9F9',
  border: '1px solid #E5E5E5',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  color: '#2C2C2C',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
  margin: '0 24px',
};

const instructionsNote = {
  fontSize: '13px',
  color: '#8B0000',
  margin: '12px 24px 0',
  fontStyle: 'italic' as const,
};

const timelineTable = {
  width: 'calc(100% - 48px)',
  margin: '16px 24px',
  borderSpacing: '0',
};

const timelineIcon = {
  fontSize: '24px',
  padding: '12px 16px 12px 0',
  verticalAlign: 'top',
  width: '40px',
};

const timelineText = {
  fontSize: '14px',
  color: '#2C2C2C',
  lineHeight: '1.6',
  padding: '12px 0',
};

const actionSection = {
  margin: '32px 24px',
  textAlign: 'center' as const,
};

const actionText = {
  fontSize: '15px',
  color: '#2C2C2C',
  margin: '0 0 16px',
  fontWeight: '500',
};

const whatsappButton = {
  backgroundColor: '#25D366',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  width: '100%',
  marginBottom: '12px',
};

const orText = {
  fontSize: '13px',
  color: '#999999',
  margin: '12px 0',
};

const statusButton = {
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
  color: '#2C2C2C',
  fontSize: '15px',
  lineHeight: '1.8',
  textAlign: 'center' as const,
  margin: '32px 24px',
};

export default CustomerOrderConfirmed;
