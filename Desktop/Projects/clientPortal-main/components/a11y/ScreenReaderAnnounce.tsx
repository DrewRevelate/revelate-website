"use client";

import { useEffect, useState } from 'react';

interface ScreenReaderAnnounceProps {
  message: string;
  assertive?: boolean;
  timeout?: number;
}

/**
 * ScreenReaderAnnounce component makes announcements for screen readers
 * Uses ARIA live regions to announce changes to screen reader users
 * 
 * @param message - The message to announce
 * @param assertive - Whether the announcement is assertive (interrupts) or polite (waits)
 * @param timeout - How long to keep the announcement in the DOM
 */
export default function ScreenReaderAnnounce({
  message,
  assertive = false,
  timeout = 3000,
}: ScreenReaderAnnounceProps) {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    // First clear the current message to ensure screen readers
    // will announce the new message even if it's the same text
    setCurrentMessage('');
    
    // Small delay to ensure the DOM updates
    const timeoutId = setTimeout(() => {
      setCurrentMessage(message);
    }, 50);
    
    // Remove message after timeout to keep DOM clean
    const clearTimeoutId = setTimeout(() => {
      setCurrentMessage('');
    }, timeout);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(clearTimeoutId);
    };
  }, [message, timeout]);

  return (
    <div 
      aria-live={assertive ? 'assertive' : 'polite'} 
      aria-atomic="true"
      className="sr-only"
    >
      {currentMessage}
    </div>
  );
}

// Utility to create a global announcer
export const createAnnouncer = () => {
  // Stack of messages to be announced
  let messageQueue: {message: string, assertive?: boolean}[] = [];
  // Whether an announcement is currently being processed
  let isAnnouncing = false;
  
  // Element for announcements
  let announcer: HTMLElement | null = null;
  
  // Initialize the announcer element
  const init = () => {
    if (typeof document === 'undefined') return;
    
    // Create the element if it doesn't exist
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.classList.add('sr-only');
      document.body.appendChild(announcer);
    }
  };
  
  // Process the next message in the queue
  const processQueue = () => {
    if (messageQueue.length === 0) {
      isAnnouncing = false;
      return;
    }
    
    isAnnouncing = true;
    const { message, assertive } = messageQueue.shift()!;
    
    if (announcer) {
      // Set the appropriate aria-live attribute
      announcer.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
      
      // Clear and then set the message
      announcer.textContent = '';
      setTimeout(() => {
        if (announcer) {
          announcer.textContent = message;
          
          // Process the next message after a delay
          setTimeout(() => {
            processQueue();
          }, 3000);
        }
      }, 50);
    }
  };
  
  // Add a message to the queue
  const announce = (message: string, assertive = false) => {
    if (typeof document === 'undefined') return;
    
    // Initialize on first use
    if (!announcer) {
      init();
    }
    
    messageQueue.push({ message, assertive });
    
    // Start processing if not already doing so
    if (!isAnnouncing) {
      processQueue();
    }
  };
  
  // Clean up the announcer
  const cleanup = () => {
    if (announcer && announcer.parentNode) {
      announcer.parentNode.removeChild(announcer);
    }
    announcer = null;
    messageQueue = [];
    isAnnouncing = false;
  };
  
  return {
    announce,
    cleanup
  };
};

// Create a singleton announcer for the entire app
export const globalAnnouncer = createAnnouncer();
