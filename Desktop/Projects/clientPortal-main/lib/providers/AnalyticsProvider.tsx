"use client";

import { ReactNode, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { reportWebVitals, logWebVitalsToConsole, sendWebVitalsToAnalytics } from '@/lib/vitals';

interface AnalyticsProviderProps {
  children: ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    // Skip analytics in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_DEV_ANALYTICS) return;
    
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Track page view
    try {
      // Send to Google Analytics if configured
      if (typeof window.gtag === 'function' && process.env.NEXT_PUBLIC_GA_ID) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: url,
          page_title: document.title,
          page_location: window.location.href,
        });
      }
      
      // You can add other analytics services here
    } catch (err) {
      console.error('[Analytics] Error tracking page view:', err);
    }
  }, [pathname, searchParams]);

  // Setup Web Vitals reporting
  useEffect(() => {
    // Skip in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_DEV_VITALS) {
      return;
    }
    
    // Setup web vitals reporting with multiple handlers
    reportWebVitals((metric) => {
      // Log to console in development
      logWebVitalsToConsole(metric);
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        sendWebVitalsToAnalytics(metric);
      }
      
      // Optional: Custom handling for specific metrics
      if (metric.name === 'LCP' && metric.value > 4000) {
        // Log poor LCP for investigation
        console.warn(`Poor LCP detected: ${metric.value}ms on ${pathname}`);
      }
    });
  }, [pathname]);

  return (
    <>
      {children}
      <Analytics debug={process.env.NODE_ENV !== 'production'} />
    </>
  );
}
