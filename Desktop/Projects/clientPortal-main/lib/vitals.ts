import { CLSMetric, FCPMetric, FIDMetric, LCPMetric, TTFBMetric } from 'web-vitals';

type MetricName = 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB';
type WebVitalsMetric = CLSMetric | FCPMetric | FIDMetric | LCPMetric | TTFBMetric;
type MetricHandler = (metric: WebVitalsMetric) => void;

/**
 * Web Vitals reporting for performance monitoring and analytics
 */
export function reportWebVitals(handler: MetricHandler): void {
  try {
    // Dynamically import web-vitals to avoid increasing the bundle size
    import('web-vitals').then(({ onCLS, onFCP, onFID, onLCP, onTTFB }) => {
      // Core Web Vitals
      onCLS(metric => handler(createMetricWithAttribution('CLS', metric)));
      onLCP(metric => handler(createMetricWithAttribution('LCP', metric)));
      onFID(metric => handler(createMetricWithAttribution('FID', metric)));
      
      // Other important metrics
      onFCP(metric => handler(createMetricWithAttribution('FCP', metric)));
      onTTFB(metric => handler(createMetricWithAttribution('TTFB', metric)));
    });
  } catch (err) {
    console.error('[Web Vitals] Error setting up monitoring:', err);
  }
}

/**
 * Enhance metric with additional attribution data
 */
function createMetricWithAttribution(name: MetricName, metric: WebVitalsMetric): WebVitalsMetric {
  const attribution: Record<string, any> = {
    id: metric.id,
    name: name,
    startTime: metric.startTime,
    value: metric.value,
    route: window.location.pathname,
    deviceType: getDeviceType(),
    connectionType: getConnectionType(),
  };

  // Add navigation type for navigation metrics
  if (metric.navigationType) {
    attribution.navigationType = metric.navigationType;
  }
  
  // Merge attribution data into the metric object
  Object.assign(metric, { attribution });
  
  return metric;
}

/**
 * Detect device type based on user agent and screen size
 */
function getDeviceType(): string {
  const ua = navigator.userAgent;
  
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
    if (window.innerWidth > 768) {
      return 'tablet';
    }
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Get connection information if available
 */
function getConnectionType(): string {
  if ('connection' in navigator && navigator.connection) {
    const conn = navigator.connection as any;
    
    if (conn.effectiveType) {
      return conn.effectiveType; // 4g, 3g, 2g, etc.
    }
    
    if (conn.type) {
      return conn.type; // wifi, cellular, etc.
    }
  }
  
  return 'unknown';
}

/**
 * Log web vitals to console in development environment
 */
export function logWebVitalsToConsole(metric: WebVitalsMetric): void {
  if (process.env.NODE_ENV !== 'production') {
    const { name, value, id } = metric;
    
    // Color code based on performance
    let style = 'color: #00c853'; // Good (green)
    
    // Thresholds based on Core Web Vitals guidelines
    if (
      (name === 'CLS' && value > 0.1) ||
      (name === 'LCP' && value > 2500) ||
      (name === 'FID' && value > 100) ||
      (name === 'TTFB' && value > 600) ||
      (name === 'FCP' && value > 1800)
    ) {
      if (
        (name === 'CLS' && value > 0.25) ||
        (name === 'LCP' && value > 4000) ||
        (name === 'FID' && value > 300) ||
        (name === 'TTFB' && value > 1000) ||
        (name === 'FCP' && value > 3000)
      ) {
        style = 'color: #ff5252'; // Poor (red)
      } else {
        style = 'color: #ffd600'; // Needs improvement (yellow)
      }
    }
    
    console.log(`%c📊 ${name}: ${value.toFixed(2)}`, style, { id, metric });
  }
}

/**
 * Send web vitals data to analytics endpoint
 */
export function sendWebVitalsToAnalytics(metric: WebVitalsMetric): void {
  try {
    // Check for analytics availability
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_name: metric.name,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_id: metric.id,
      });
    }
    
    // You can also send to your custom analytics endpoint
    // const body = JSON.stringify({ ...metric, page: window.location.pathname });
    // navigator.sendBeacon('/api/analytics/vitals', body);
  } catch (err) {
    console.error('[Web Vitals] Error sending metrics:', err);
  }
}
