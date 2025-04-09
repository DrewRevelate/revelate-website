import { forwardRef, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  isFullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      label, 
      helperText, 
      error, 
      isFullWidth = true, 
      className = '', 
      id, 
      ...props 
    }, 
    ref
  ) => {
    // Generate a random ID if none is provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className={`${isFullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`
            flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 
            focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50
            dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:placeholder-gray-400
            dark:focus:ring-primary-400 dark:focus:border-primary-400
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${isFullWidth ? 'w-full' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {helperText && !error && (
          <p 
            id={`${inputId}-helper`} 
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
        
        {error && (
          <p 
            id={`${inputId}-error`} 
            className="mt-1 text-xs text-red-500 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

// Display name for React DevTools
Input.displayName = 'Input';

export default Input;
