import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FoodPrints',
  description: 'A food map application for Iloilo City',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>{/* Mapbox CSS is imported in the component directly */}</head>
      <body className={inter.className}>
        <div>{children}</div>
      </body>
    </html>
  );
}
