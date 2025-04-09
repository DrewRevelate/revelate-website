import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RevelateOps Client Portal',
  description: 'Secure client portal for RevelateOps clients to track projects, tasks, meetings, and documents.',
  applicationName: 'RevelateOps Client Portal',
  authors: [{ name: 'RevelateOps' }],
  keywords: ['client portal', 'project management', 'tasks', 'meetings', 'documents', 'time tracking'],
  creator: 'RevelateOps',
  publisher: 'RevelateOps',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'noindex, nofollow',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://portal.revelateops.com',
    title: 'RevelateOps Client Portal',
    description: 'Secure client portal for RevelateOps clients',
    siteName: 'RevelateOps Client Portal',
  },
};
