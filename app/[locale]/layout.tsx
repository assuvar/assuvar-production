import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../globals.css";
import { locales } from '@/src/i18n/navigation';
import { ContactModalProvider } from '@/context/ContactModalContext';
import ContactModal from '@/components/ui/ContactModal';
import FooterContactForm from '@/components/FooterContactForm';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space-grotesk' });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://assuvar.com'; // Replace with actual domain

  const languages: Record<string, string> = {};
  locales.forEach(l => {
    languages[l] = `${baseUrl}/${l}`;
  });

  return {
    title: "Assuvar • Next-Gen Infrastructure",
    description: "The complete IT backbone for modern enterprises. We fuse resilient infrastructure with cutting-edge software to build, scale, and sustain.",
    icons: {
      icon: '/assets/logo.svg',
      shortcut: '/assets/logo.svg',
      apple: '/assets/logo.svg',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ...languages,
        'x-default': `${baseUrl}/en-US`
      }
    }
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const isRtl = locale.startsWith('ar');

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased selection:bg-structura-blue selection:text-white`}>
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <Navbar />
            {children}
            <FooterContactForm />
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
