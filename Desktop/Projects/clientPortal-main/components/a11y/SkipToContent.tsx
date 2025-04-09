"use client";

/**
 * SkipToContent component provides a keyboard-accessible way to skip to main content
 * Only visible when focused, helps keyboard users bypass navigation and quickly reach main content
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:p-4 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}
