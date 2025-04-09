"use client";

import { useRef, useEffect } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  focusFirst?: boolean;
  returnFocusOnDeactivate?: boolean;
  className?: string;
}

/**
 * FocusTrap component traps focus within contained elements when active.
 * Useful for modals, dialogs, and dropdown menus to ensure keyboard navigation remains within the component.
 */
export default function FocusTrap({
  children,
  isActive,
  focusFirst = true,
  returnFocusOnDeactivate = true,
  className = "",
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element when trap activates
  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isActive]);

  // Handle focus trap activation/deactivation
  useEffect(() => {
    if (!isActive) {
      if (returnFocusOnDeactivate && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Find all focusable elements within the container
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when trap activates
    if (focusFirst && firstElement && isActive) {
      firstElement.focus();
    }

    // Handler for keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if not tab key
      if (event.key !== 'Tab') return;

      // Handle tab and shift+tab navigation
      if (event.shiftKey) {
        // If shift+tab on first element, move to last element
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // If tab on last element, move to first element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add event listener for keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, focusFirst, returnFocusOnDeactivate]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
