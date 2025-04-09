"use client";

import { Component, ReactNode, ErrorInfo } from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

interface ErrorBoundaryProps {
  /**
   * The content to render
   */
  children: ReactNode;
  
  /**
   * The fallback UI to render when an error occurs
   */
  fallback?: ReactNode;
  
  /**
   * Optional callback to execute when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  /**
   * Whether an error has occurred
   */
  hasError: boolean;
  
  /**
   * The error that occurred
   */
  error: Error | null;
}

/**
 * ErrorBoundary component to gracefully handle errors in the UI
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when an error occurs
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log the error and call the onError callback
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset the error state to try again
   */
  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Otherwise use default error UI
      return (
        <div className="p-6 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-center">
          <FiAlertCircle className="h-10 w-10 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.resetErrorBoundary}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            aria-label="Try again"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}

/**
 * Client-side only ErrorBoundary component wrapper
 */
export function ClientErrorBoundary({ children, ...props }: ErrorBoundaryProps) {
  return <ErrorBoundary {...props}>{children}</ErrorBoundary>;
}
