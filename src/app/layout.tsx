import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import BackToTop from '@/components/BackToTop';
import AIAssistant from '@/components/AIAssistant';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Wheeligo | Premium Self-Drive Car Rentals',
  description: 'Rent premium self-drive luxury cars including Tesla, Porsche, BMW, Mercedes, and Audi. Easy online KYC and direct bookings via WhatsApp.',
  keywords: 'luxury car rental, self-drive car rental, rent tesla, rent bmw, rent porsche, premium car rental, monthly car leasing',
  openGraph: {
    title: 'Wheeligo | Premium Self-Drive Car Rentals',
    description: 'Experience luxury on your own terms. Direct WhatsApp booking with Zero-Depreciation insurance and 24/7 Roadside support.',
    type: 'website',
    url: 'https://wheeligo.com',
    images: [
      {
        url: '/images/og-share.jpg',
        width: 1200,
        height: 630,
        alt: 'Wheeligo Luxury Car Rentals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wheeligo | Premium Self-Drive Car Rentals',
    description: 'Experience luxury on your own terms. Direct WhatsApp booking with Zero-Depreciation insurance.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-background text-foreground transition-colors duration-300">
        <AppProvider>
          {/* Main sticky navigation */}
          <Header />
          
          {/* Main Content Area */}
          <main className="flex-grow pt-20">
            {children}
          </main>
          
          {/* Global Footer */}
          <Footer />

          {/* Core Interactive Floating Widgets */}
          <WhatsAppFloat />
          <BackToTop />
          <AIAssistant />
        </AppProvider>
      </body>
    </html>
  );
}
