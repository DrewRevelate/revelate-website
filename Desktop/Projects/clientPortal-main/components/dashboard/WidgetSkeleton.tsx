"use client";

import { ReactNode } from 'react';

interface WidgetSkeletonProps {
  icon: ReactNode;
  title: string;
}

export default function WidgetSkeleton({ icon, title }: WidgetSkeletonProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h2>
        <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="p-4">
        <div className="space-y-3" aria-busy="true" aria-live="polite">
          {Array.from({ length: 2 }).map((_, i) => (
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
      </div>
    </div>
  );
}
