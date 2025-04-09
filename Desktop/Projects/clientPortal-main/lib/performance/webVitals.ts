import { ReportHandler } from 'web-vitals';

// Web Vitals reporting utility
export const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function' && typeof window !== 'undefined') {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry); // Cumulative Layout Shift
      onFID(onPerfEntry); // First Input Delay
      onFCP(onPerfEntry); // First Contentful Paint
      onLCP(onPerfEntry); // Largest Contentful Paint
      onTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

// Helper to send metrics to analytics
export const sendToAnalytics = ({ name, delta, id }: { name: string; delta: number; id: string }) => {
  // This can be connected to your analytics platform of choice
  // Example: Google Analytics, Vercel Analytics, etc.
  
  // For now, log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vitals: ${name}`, {
      value: delta,
      id
    });
  }
  
  // Implement actual analytics reporting here
  // Example for Vercel Analytics:
  // const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  // if (!analyticsId) return;
  // 
  // fetch(`/api/vitals?id=${analyticsId}`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     name,
  //     delta,
  //     id,
  //   }),
  // });
};
