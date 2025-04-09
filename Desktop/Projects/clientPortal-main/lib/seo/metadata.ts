import { Metadata } from 'next';

// Base metadata configuration
const BASE_URL = 'https://client-portal.revelateops.com';
const SITE_NAME = 'RevelateOps Client Portal';
const DEFAULT_DESCRIPTION = 'Secure client portal for RevelateOps clients to track projects, tasks, meetings, and documents.';

/**
 * Creates standardized metadata for all pages in the application
 * @param options - Page-specific metadata options
 * @returns Next.js Metadata object
 */
export function createMetadata(options: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  additionalMetaTags?: Array<{ name: string; content: string }>;
  jsonLd?: Record<string, any>;
} = {}): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION, 
    path = '',
    ogImage = '/images/og-image.jpg',
    noIndex = false,
    additionalMetaTags = [],
    jsonLd,
  } = options;

  // Format title with site name
  const formattedTitle = title 
    ? `${title} | ${SITE_NAME}` 
    : SITE_NAME;
  
  // Construct full URL for canonical and OG URLs
  const url = path ? `${BASE_URL}/${path.replace(/^\//, '')}` : BASE_URL;
  const ogImageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `${BASE_URL}${ogImage}`;

  const metadata: Metadata = {
    // Basic metadata
    title: formattedTitle,
    description,
    
    // Canonical URL
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    
    // OpenGraph metadata
    openGraph: {
      type: 'website',
      url,
      title: formattedTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description,
      images: [ogImageUrl],
    },
    
    // Robots directives
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification (customize with your verification codes)
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      // Add other verification codes as needed:
      // yandex: 'your-yandex-verification',
      // bing: 'your-bing-verification',
    },
    
    // Viewport settings
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
      themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
        { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
      ],
    },
    
    // App metadata
    applicationName: SITE_NAME,
    appleWebApp: {
      capable: true,
      title: SITE_NAME,
      statusBarStyle: 'default',
    },
    
    // Icons
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [
        { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
      ],
    },

    // Additional meta tags
    other: Object.fromEntries(
      additionalMetaTags.map(({ name, content }) => [name, content])
    ),
  };

  return metadata;
}

// Generate JSON-LD structured data for the page
export function generateJsonLd(data: Record<string, any>): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

// Commonly used JSON-LD templates
export const jsonLdTemplates = {
  // Organization schema
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RevelateOps',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'support@revelateops.com',
    },
    sameAs: [
      'https://www.linkedin.com/company/revelateops',
      'https://twitter.com/revelateops',
    ],
  },
  
  // Service schema
  clientPortalService: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: DEFAULT_DESCRIPTION,
  },
};
