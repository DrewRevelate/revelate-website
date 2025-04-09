"use client";

import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  
  // Detect client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Server-side rendering fallback
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-pulse h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="animate-pulse h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
}
