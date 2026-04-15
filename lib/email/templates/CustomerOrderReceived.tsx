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

interface CustomerOrderReceivedProps {
  order: Order;
  statusUrl: string;
  whatsappUrl: string;
}

export function CustomerOrderReceived({
  order,
  statusUrl,
  whatsappUrl,
}: CustomerOrderReceivedProps) {
  const deliveryDate = new Date(order.delivery_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Order Received - Kinchana's Bakery - Order #{order.id.slice(0, 8)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Your Order! 🎉</Heading>

          <Text style={greeting}>Dear {order.customer_name},</Text>

          <Text style={paragraph}>
            We've received your order and will confirm availability within 24 hours.
            You'll receive another email once we confirm your order.
          </Text>

          <Section style={orderBox}>
            <Text style={orderLabel}>Order Number</Text>
            <Text style={orderNumber}>#{order.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={deliveryLabel}>Delivery Date</Text>
            <Text style={deliveryDateStyle}>{deliveryDate}</Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>Order Summary</Heading>
            <table style={table}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E5E5' }}>
                  <th style={tableHeader}>Item</th>
                  <th style={{ ...tableHeader, textAlign: 'center' }}>Qty</th>
                  <th style={{ ...tableHeader, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item: OrderItem, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #F5F5F5' }}>
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
                  <td colSpan={2} style={{ ...totalLabel, textAlign: 'right', paddingTop: '12px' }}>
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
            <Button href={statusUrl} style={statusButton}>
              Track Order Status
            </Button>

            <Text style={contactText}>Have questions about your order?</Text>
            <Button href={whatsappUrl} style={whatsappButton}>
              📱 Contact Us on WhatsApp
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            With love from Kinchana's Bakery
            <br />
            <span style={{ color: '#999999', fontSize: '11px' }}>Order ID: {order.id}</span>
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

const greeting = {
  fontSize: '16px',
  color: '#2C2C2C',
  margin: '0 0 16px',
};

const paragraph = {
  fontSize: '15px',
  color: '#666666',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const orderBox = {
  backgroundColor: '#FFF9F0',
  border: '2px solid #8B0000',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const orderLabel = {
  fontSize: '12px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 4px',
};

const orderNumber = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#8B0000',
  margin: '0 0 16px',
};

const deliveryLabel = {
  fontSize: '12px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '16px 0 4px',
  paddingTop: '16px',
  borderTop: '1px solid #FFE4E1',
};

const deliveryDateStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2C2C2C',
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
  fontWeight: '500',
};

const totalLabel = {
  color: '#2C2C2C',
  fontSize: '15px',
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
  backgroundColor: '#F9F9F9',
  border: '1px solid #E5E5E5',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  color: '#2C2C2C',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
};

const actionSection = {
  marginTop: '32px',
  textAlign: 'center' as const,
};

const statusButton = {
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
  marginBottom: '24px',
};

const contactText = {
  fontSize: '14px',
  color: '#666666',
  margin: '24px 0 12px',
};

const whatsappButton = {
  backgroundColor: '#ffffff',
  border: '1px solid #25D366',
  borderRadius: '6px',
  color: '#25D366',
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
  fontSize: '14px',
  lineHeight: '1.8',
  textAlign: 'center' as const,
  marginTop: '32px',
};

export default CustomerOrderReceived;
