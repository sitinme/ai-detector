import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AIWritingCheck — Free AI Content Detector | Check if Text is AI Generated',
    template: '%s | AIWritingCheck',
  },
  description: 'Free AI content detector. Check if text was written by ChatGPT, Claude, or other AI. No sign-up required. Instant results with detailed analysis.',
  keywords: ['ai content detector', 'ai writing detector', 'chatgpt detector', 'ai text detector free', 'check if text is ai generated'],
  openGraph: {
    title: 'AIWritingCheck — Free AI Content Detector',
    description: 'Check if text was written by AI. Free, instant, no sign-up.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');` }} />
          </>
        )}
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
