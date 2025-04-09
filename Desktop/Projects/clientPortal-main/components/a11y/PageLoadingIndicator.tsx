"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { globalAnnouncer } from './ScreenReaderAnnounce';
import { FiLoader } from 'react-icons/fi';

/**
 * PageLoadingIndicator shows a loading state during navigation
 * - Visual indicator at the top of the page
 * - Accessible announcements for screen readers
 */
export default function PageLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset loading state and announce page changes
  useEffect(() => {
    const currentUrl = pathname + searchParams.toString();
    
    // Show loading state
    setIsLoading(true);
    
    // Announce to screen readers
    globalAnnouncer.announce("Page is loading", true);
    
    // Hide loading indicator after 300ms (minimum time to show indicator)
    const timeout = setTimeout(() => {
      setIsLoading(false);
      // Announce page content loaded
      globalAnnouncer.announce("Page loaded", true);
    }, 300);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);
  
  if (!isLoading) return null;
  
  return (
    <div 
      aria-hidden="true" // Hidden from screen readers as we use announcer instead
      className="fixed top-0 left-0 right-0 z-50 bg-primary-600"
    >
      <div className="h-1 w-full bg-primary-600 relative overflow-hidden">
        <div className="absolute h-full w-1/4 bg-white opacity-20 rounded-full animate-pulse animate-loading-bar"></div>
      </div>
      
      <style jsx>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-loading-bar {
          animation: loadingBar 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
