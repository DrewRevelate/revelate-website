"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /**
   * Page title
   */
  title: string;
  
  /**
   * Optional subtitle or description text
   */
  subtitle?: string;
  
  /**
   * Optional icon to display before the title
   */
  icon?: ReactNode;
  
  /**
   * Optional actions to display in the header (buttons, links, etc.)
   */
  actions?: ReactNode;
  
  /**
   * Optional background style
   */
  background?: 'none' | 'light' | 'gradient' | 'colored';
  
  /**
   * Optional padding style
   */
  padding?: 'none' | 'small' | 'medium' | 'large';
  
  /**
   * Optional margin bottom style
   */
  marginBottom?: 'none' | 'small' | 'medium' | 'large';
  
  /**
   * Optional custom class names
   */
  className?: string;
  
  /**
   * Optional custom ID for the heading
   */
  headingId?: string;
}

/**
 * PageHeader component for consistent page headers throughout the application
 */
export default function PageHeader({
  title,
  subtitle,
  icon,
  actions,
  background = 'none',
  padding = 'medium',
  marginBottom = 'medium',
  className = '',
  headingId,
}: PageHeaderProps) {
  // Map background styles to Tailwind classes
  const backgroundClasses = {
    none: '',
    light: 'bg-gray-50 dark:bg-gray-800/50',
    gradient: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white',
    colored: 'bg-primary-600 text-white',
  };
  
  // Map padding styles to Tailwind classes
  const paddingClasses = {
    none: '',
    small: 'py-2 px-4',
    medium: 'py-4 px-6',
    large: 'py-6 px-8',
  };
  
  // Map margin styles to Tailwind classes
  const marginClasses = {
    none: '',
    small: 'mb-2',
    medium: 'mb-6',
    large: 'mb-8',
  };
  
  // Apply the selected styles
  const headerClasses = cn(
    'rounded-lg',
    background !== 'none' && 'shadow-sm',
    backgroundClasses[background],
    paddingClasses[padding],
    marginClasses[marginBottom],
    background === 'gradient' || background === 'colored' ? 'border-none' : 'border border-gray-200 dark:border-gray-700',
    className
  );
  
  return (
    <header className={headerClasses}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          {/* Optional icon */}
          {icon && <span className="mr-2">{icon}</span>}
          
          {/* Title and subtitle */}
          <div>
            <h1 
              id={headingId} 
              className={cn(
                "text-2xl font-bold",
                (background === 'gradient' || background === 'colored') ? 'text-white' : 'text-gray-900 dark:text-white'
              )}
            >
              {title}
            </h1>
            
            {subtitle && (
              <p 
                className={cn(
                  "mt-1 text-sm",
                  (background === 'gradient' || background === 'colored') ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Actions */}
        {actions && (
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
