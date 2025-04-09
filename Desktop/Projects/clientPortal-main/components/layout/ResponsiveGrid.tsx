"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  /**
   * Grid items to display
   */
  children: ReactNode;
  
  /**
   * Number of columns on mobile (default: 1)
   */
  mobileCols?: 1 | 2;
  
  /**
   * Number of columns on tablet (default: 2)
   */
  tabletCols?: 1 | 2 | 3;
  
  /**
   * Number of columns on desktop (default: 3)
   */
  desktopCols?: 1 | 2 | 3 | 4;
  
  /**
   * Gap between grid items (default: 6)
   */
  gap?: 2 | 4 | 6 | 8 | 10;
  
  /**
   * Additional classes to apply to the grid
   */
  className?: string;
  
  /**
   * Whether to wrap the grid in a container with max width
   */
  container?: boolean;
}

/**
 * ResponsiveGrid component for creating responsive grid layouts
 * Automatically adjusts columns based on screen size
 */
export default function ResponsiveGrid({
  children,
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  gap = 6,
  className = '',
  container = false,
}: ResponsiveGridProps) {
  // Map number of columns to Tailwind classes
  const mobileColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
  };
  
  const tabletColsMap: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
  };
  
  const desktopColsMap: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };
  
  // Map gap to Tailwind classes
  const gapMap: Record<number, string> = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
  };
  
  // Generate the grid classes
  const gridClasses = cn(
    'grid',
    mobileColsMap[mobileCols],
    tabletColsMap[tabletCols],
    desktopColsMap[desktopCols],
    gapMap[gap],
    className
  );
  
  // If container is true, wrap the grid in a max-width container
  if (container) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className={gridClasses}>{children}</div>
      </div>
    );
  }
  
  // Otherwise, just return the grid
  return <div className={gridClasses}>{children}</div>;
}
