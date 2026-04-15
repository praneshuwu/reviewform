import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/contexts/CartContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kinchanas.com"),
  title: "Kinchana's | Baked with Love",
  description: "We craft each creation with care and intention — from rich, layered cakes to delicate pastries. Explore what we offer or share your thoughts with us.",
  openGraph: {
    title: "Kinchana's | Baked with Love",
    description: "We craft each creation with care and intention — from rich, layered cakes to delicate pastries. Explore what we offer or share your thoughts with us.",
    url: "https://www.kinchanas.com",
    siteName: "Kinchana's Bakery",
    images: [
      {
        url: "https://www.kinchanas.com/meta.png",
        width: 1200,
        height: 630,
        alt: "Kinchana's Bakery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinchana's | Baked with Love",
    description: "We craft each creation with care and intention — from rich, layered cakes to delicate pastries. Explore what we offer or share your thoughts with us.",
    images: ["https://www.kinchanas.com/meta.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
