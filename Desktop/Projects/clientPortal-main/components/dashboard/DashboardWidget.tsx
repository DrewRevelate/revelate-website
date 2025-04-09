"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface DashboardWidgetProps {
  title: string;
  icon: ReactNode;
  viewAllLink?: string;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyMessage: string;
  onRetry?: () => void;
  children: ReactNode;
}

// Dashboard widget component
export default function DashboardWidget({ 
  title, 
  icon, 
  viewAllLink, 
  isLoading, 
  error, 
  isEmpty, 
  emptyMessage,
  onRetry, 
  children 
}: DashboardWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
            aria-label={`View all ${title}`}
          >
            View All <FiArrowRight className="ml-1" aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="p-4">
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <ErrorMessage message={error} retry={onRetry} />
        ) : isEmpty ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// Skeleton loader component for better loading UX
export function SkeletonLoader({ count = 2, className = "" }: { count?: number, className?: string }) {
  return (
    <div className={`space-y-3 ${className}`} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="p-3 border border-gray-100 dark:border-gray-700 rounded-md animate-pulse"
        >
          <div className="flex justify-between">
            <div className="w-2/3 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-1/4 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="w-1/2 h-4 mt-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );
}

// Error message component with better guidance
export function ErrorMessage({ message = "Failed to load data", retry }: { message?: string, retry?: () => void }) {
  return (
    <div className="text-center py-4 text-red-500 dark:text-red-400">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 mx-auto mb-2" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <p>{message}</p>
      <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
        This could be due to connectivity or permissions.
      </p>
      {retry && (
        <button 
          onClick={retry} 
          className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Try again
        </button>
      )}
    </div>
  );
}
