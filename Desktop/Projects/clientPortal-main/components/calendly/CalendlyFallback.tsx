'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface CalendlyFallbackProps {
  username: string;
  className?: string;
}

export default function CalendlyFallback({ 
  username = 'drewlambert', // Updated to the correct username
  className = '' 
}: CalendlyFallbackProps) {
  const calendlyUrl = `https://calendly.com/${username}`;
  
  return (
    <Card className={`p-6 text-center ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Schedule a Meeting</h3>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Use the button below to schedule a meeting with RevelateOps.
      </p>
      <div className="flex justify-center">
        <a 
          href={calendlyUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button>
            Open Scheduling Page
          </Button>
        </a>
      </div>
    </Card>
  );
}
