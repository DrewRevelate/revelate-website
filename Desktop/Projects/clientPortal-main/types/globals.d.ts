interface Window {
  // Google Analytics
  gtag?: (
    command: string,
    targetId: string,
    params?: { [key: string]: any }
  ) => void;
  
  // For performance measurements
  performance: {
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
    getEntriesByName(name: string, type?: string): PerformanceEntry[];
    clearMarks(name?: string): void;
    clearMeasures(name?: string): void;
  };
}

// Expose environment variables types
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_ENABLE_DEV_ANALYTICS?: string;
    NEXT_PUBLIC_ENABLE_DEV_VITALS?: string;
  }
}
