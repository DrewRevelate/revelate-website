"use client";

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import AnalyticsProvider from './AnalyticsProvider';

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Detect client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <AuthProvider>
      <AnalyticsProvider>
        {children}
      </AnalyticsProvider>
    </AuthProvider>
  ) : (
    // Server-side rendering fallback
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-pulse h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="animate-pulse h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
}
