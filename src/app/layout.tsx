import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Open_Sans, Faustina } from 'next/font/google';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const faustina = Faustina({
  subsets: ['latin'],
  variable: '--font-faustina',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FoodPrints',
  description: 'A food map application for Iloilo City',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${faustina.variable}`}>
      <head>
        {/* Mapbox CSS is imported in the component directly */}
      </head>
      <body className="font-open-sans">
        <div>{children}</div>
      </body>
    </html>
  );
}
