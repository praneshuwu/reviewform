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

interface CustomerOrderRejectedProps {
  order: Order;
  rejectionReason: string;
  whatsappUrl: string;
  newOrderUrl: string;
}

export function CustomerOrderRejected({
  order,
  rejectionReason,
  whatsappUrl,
  newOrderUrl,
}: CustomerOrderRejectedProps) {
  const deliveryDate = new Date(order.delivery_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Order Update - Kinchana's Bakery - Order #{order.id.slice(0, 8)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Update</Heading>

          <Text style={greeting}>Dear {order.customer_name},</Text>

          <Text style={paragraph}>
            Thank you for choosing Kinchana's Bakery. We truly appreciate your interest
            in our products. Unfortunately, we are unable to fulfill your order for {deliveryDate}.
          </Text>

          <Section style={reasonBox}>
            <Text style={reasonLabel}>Reason:</Text>
            <Text style={reasonText}>{rejectionReason}</Text>
          </Section>

          <Text style={paragraph}>
            We understand this is disappointing, and we sincerely apologize for any inconvenience.
            We'd love to help you find an alternative solution that works for you.
          </Text>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>Your Original Order Details</Heading>
            <Text style={orderIdText}>Order #{order.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={metaText}>Requested Delivery: {deliveryDate}</Text>

            <table style={table}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <th style={tableHeader}>Item</th>
                  <th style={{ ...tableHeader, textAlign: 'center' }}>Qty</th>
                  <th style={{ ...tableHeader, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item: OrderItem, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #F9F9F9' }}>
                    <td style={itemName}>{item.name}</td>
                    <td style={{ ...itemQty, textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ ...itemPrice, textAlign: 'right' }}>
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>What Can We Do?</Heading>

            <table style={optionsTable}>
              <tbody>
                <tr>
                  <td style={optionIcon}>📅</td>
                  <td style={optionText}>
                    <strong>Try a Different Date</strong> - We may have availability on other dates
                  </td>
                </tr>
                <tr>
                  <td style={optionIcon}>🎂</td>
                  <td style={optionText}>
                    <strong>Alternative Items</strong> - We can suggest similar products we can deliver
                  </td>
                </tr>
                <tr>
                  <td style={optionIcon}>💬</td>
                  <td style={optionText}>
                    <strong>Custom Solution</strong> - Let's chat and find what works best for you
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          <Section style={actionSection}>
            <Text style={actionText}>We'd love to make this work!</Text>

            <Button href={whatsappUrl} style={whatsappButton}>
              📱 Chat with Us on WhatsApp
            </Button>

            <Text style={orText}>or</Text>

            <Button href={newOrderUrl} style={newOrderButton}>
              🛒 Place a New Order for Different Date
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={apologyBox}>
            <Text style={apologyText}>
              We're truly sorry we couldn't accommodate your original request.
              Your satisfaction means everything to us, and we hope to serve you soon.
            </Text>
          </Section>

          <Text style={footer}>
            With sincere apologies,
            <br />
            <strong>Team Kinchana's Bakery</strong>
            <br />
            <span style={{ color: '#999999', fontSize: '12px', display: 'block', marginTop: '12px' }}>
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
  padding: '40px 24px',
  maxWidth: '600px',
  border: '1px solid #E5E5E5',
  borderRadius: '8px',
};

const h1 = {
  color: '#2C2C2C',
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
  lineHeight: '1.7',
  margin: '0 0 20px',
};

const reasonBox = {
  backgroundColor: '#FFF5F5',
  border: '1px solid #FFE4E1',
  borderLeft: '4px solid #8B0000',
  borderRadius: '6px',
  padding: '20px',
  margin: '24px 0',
};

const reasonLabel = {
  fontSize: '12px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px',
  fontWeight: '600',
};

const reasonText = {
  fontSize: '15px',
  color: '#2C2C2C',
  lineHeight: '1.6',
  margin: '0',
};

const orderIdText = {
  fontSize: '13px',
  color: '#999999',
  margin: '0 0 4px',
};

const metaText = {
  fontSize: '13px',
  color: '#999999',
  margin: '0 0 16px',
};

const hr = {
  borderColor: '#E5E5E5',
  margin: '32px 0',
};

const table = {
  width: '100%',
  marginTop: '12px',
};

const tableHeader = {
  color: '#666666',
  fontSize: '12px',
  fontWeight: '600',
  padding: '10px 8px',
  textAlign: 'left' as const,
};

const itemName = {
  color: '#999999',
  fontSize: '14px',
  padding: '10px 8px',
};

const itemQty = {
  color: '#999999',
  fontSize: '14px',
  padding: '10px 8px',
};

const itemPrice = {
  color: '#999999',
  fontSize: '14px',
  padding: '10px 8px',
};

const optionsTable = {
  width: '100%',
  margin: '16px 0',
  borderSpacing: '0',
};

const optionIcon = {
  fontSize: '24px',
  padding: '12px 16px 12px 0',
  verticalAlign: 'top',
  width: '40px',
};

const optionText = {
  fontSize: '14px',
  color: '#2C2C2C',
  lineHeight: '1.6',
  padding: '12px 0',
};

const actionSection = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const actionText = {
  fontSize: '16px',
  color: '#2C2C2C',
  margin: '0 0 20px',
  fontWeight: '600',
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

const newOrderButton = {
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

const apologyBox = {
  backgroundColor: '#FFF9F0',
  borderRadius: '6px',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '32px 0 24px',
};

const apologyText = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '1.7',
  margin: '0',
  fontStyle: 'italic' as const,
};

const footer = {
  color: '#2C2C2C',
  fontSize: '15px',
  lineHeight: '1.8',
  textAlign: 'center' as const,
  margin: '24px 0 0',
};

export default CustomerOrderRejected;
