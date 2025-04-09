'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Simple redirect page for Calendly
export default function CalendlyRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Default Calendly link with the correct username
    let calendlyUrl = 'https://calendly.com/drewlambert';
    
    // Check if event type is specified in query params
    const eventType = searchParams.get('event');
    if (eventType) {
      calendlyUrl += `/${eventType}`;
    }
    
    // Add query params for prefilling if available
    const email = searchParams.get('email');
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    
    if (email || firstName || lastName) {
      calendlyUrl += '?';
      
      const params = [];
      if (email) params.push(`email=${encodeURIComponent(email)}`);
      if (firstName) params.push(`firstName=${encodeURIComponent(firstName)}`);
      if (lastName) params.push(`lastName=${encodeURIComponent(lastName)}`);
      
      calendlyUrl += params.join('&');
    }
    
    // Redirect to Calendly
    window.location.href = calendlyUrl;
  }, [searchParams]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">Redirecting to Scheduling Page</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we redirect you to our scheduling page...
        </p>
      </div>
    </div>
  );
}
