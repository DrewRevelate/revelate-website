"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { useMemo } from 'react';
import SchemaOrg, { schemaTemplates } from '@/lib/seo/SchemaOrg';

interface BreadcrumbsProps {
  /**
   * Optional custom home label
   */
  homeLabel?: string;
  
  /**
   * Optional custom breadcrumbs that override automatic path-based breadcrumbs
   */
  items?: {
    label: string;
    href: string;
  }[];
  
  /**
   * Whether to show the home icon
   */
  showHomeIcon?: boolean;
  
  /**
   * Custom class name for the breadcrumbs container
   */
  className?: string;
}

/**
 * Breadcrumbs component with automatic path mapping and structured data
 */
export default function Breadcrumbs({
  homeLabel = 'Dashboard',
  items: customItems,
  showHomeIcon = true,
  className = '',
}: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname or use custom items
  const breadcrumbs = useMemo(() => {
    if (customItems) {
      return customItems;
    }
    
    // Parse the current path
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Create breadcrumb items
    const items = [
      {
        label: homeLabel,
        href: '/dashboard',
      },
    ];
    
    // Add path segments as breadcrumb items
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Get a human-readable label for the segment
      let label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
        
      // Specific override for known paths
      if (segment === 'projects') label = 'Projects';
      if (segment === 'tasks') label = 'Tasks';
      if (segment === 'meetings') label = 'Meetings';
      if (segment === 'documents') label = 'Documents';
      if (segment === 'time-tracking') label = 'Time Tracking';
      if (segment === 'settings') label = 'Settings';
      
      items.push({
        label,
        href: currentPath,
      });
    });
    
    return items;
  }, [pathname, homeLabel, customItems]);
  
  // Create schema.org structured data for breadcrumbs
  const breadcrumbsSchema = useMemo(() => {
    return schemaTemplates.breadcrumbs(
      breadcrumbs.map(item => ({
        name: item.label,
        url: `https://client-portal.revelateops.com${item.href}`,
      }))
    );
  }, [breadcrumbs]);
  
  return (
    <>
      {/* Schema.org breadcrumbs */}
      <SchemaOrg data={breadcrumbsSchema} />
      
      {/* Breadcrumbs UI */}
      <nav 
        aria-label="Breadcrumbs" 
        className={`flex items-center text-sm text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap pb-2 ${className}`}
      >
        <ol className="flex items-center space-x-1">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.href} className="flex items-center">
              {index > 0 && (
                <FiChevronRight className="mx-1 h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              )}
              
              {index === breadcrumbs.length - 1 ? (
                // Last item is current page (not a link)
                <span 
                  aria-current="page" 
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  {index === 0 && showHomeIcon ? (
                    <span className="flex items-center">
                      <FiHome className="mr-1 h-4 w-4" aria-hidden="true" />
                      <span>{breadcrumb.label}</span>
                    </span>
                  ) : (
                    breadcrumb.label
                  )}
                </span>
              ) : (
                // Other items are links
                <Link
                  href={breadcrumb.href}
                  className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {index === 0 && showHomeIcon ? (
                    <span className="flex items-center">
                      <FiHome className="mr-1 h-4 w-4" aria-hidden="true" />
                      <span>{breadcrumb.label}</span>
                    </span>
                  ) : (
                    breadcrumb.label
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
