import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import { Metadata, Viewport } from 'next';
import ClientProvider from '@/lib/providers/ClientProvider';

// Font configuration - preload critical fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
  preload: true,
});

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: {
    template: '%s | RevelateOps Client Portal',
    default: 'RevelateOps Client Portal',
  },
  description: 'Secure client portal for RevelateOps clients to track projects, tasks, meetings, and documents.',
  metadataBase: new URL('https://client-portal.revelateops.com'),
  openGraph: {
    type: 'website',
    title: 'RevelateOps Client Portal',
    description: 'Manage your projects, tasks, meetings, and documents all in one secure place.',
    url: 'https://client-portal.revelateops.com',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Viewport configuration for mobile responsiveness
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${lexend.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen antialiased">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
