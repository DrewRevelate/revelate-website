"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { OptimizedImage } from '@/components/ui/Image';
import { FiLoader } from 'react-icons/fi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { user, isLoading, refreshSession } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Refresh session on initial load
    const checkAuth = async () => {
      await refreshSession();
      setAuthChecked(true);
    };
    
    checkAuth();
  }, [refreshSession]);

  useEffect(() => {
    // Only redirect if we're on the client and the auth check is complete
    if (isClient && authChecked && !isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router, isClient, authChecked]);

  // Show loading screen while checking authentication
  if (!isClient || isLoading || !authChecked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <OptimizedImage
            src="/logo.svg"
            alt="RevelateOps Logo"
            width={180}
            height={48}
            priority
            sizes="180px"
            className="w-auto h-auto"
            loadingPlaceholder={
              <div className="w-[180px] h-[48px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            }
          />
        </div>
        <FiLoader className="animate-spin h-10 w-10 text-primary-600 dark:text-primary-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Loading your portal...
        </p>
      </div>
    );
  }

  // If not authenticated and check complete, the above useEffect will redirect
  // This is just a fallback
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
