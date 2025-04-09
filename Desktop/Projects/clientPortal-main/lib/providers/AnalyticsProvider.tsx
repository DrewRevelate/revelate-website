"use client";

import { ReactNode, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { reportWebVitals, sendToAnalytics } from '@/lib/performance/webVitals';

interface AnalyticsProviderProps {
  children: ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    // Skip analytics in development 
    if (process.env.NODE_ENV === 'development') return;
    
    const url = pathname + searchParams.toString();
    
    // Example: Send page view to your analytics service
    // E.g., Google Analytics or custom endpoint
    try {
      // Track page view
      window.gtag?.('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: url,
      });
    } catch (err) {
      console.error('Error sending analytics:', err);
    }
  }, [pathname, searchParams]);

  // Setup Web Vitals reporting
  useEffect(() => {
    // Report Web Vitals
    reportWebVitals((metric) => {
      sendToAnalytics({
        name: metric.name,
        delta: metric.delta,
        id: metric.id,
      });
    });
  }, []);

  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
