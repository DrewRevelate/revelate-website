import { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  isFullWidth?: boolean;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { 
      label, 
      helperText, 
      error, 
      isFullWidth = true, 
      className = '', 
      id, 
      options,
      ...props 
    }, 
    ref
  ) => {
    // Generate a random ID if none is provided
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className={`${isFullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          id={selectId}
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
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {helperText && !error && (
          <p 
            id={`${selectId}-helper`} 
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
        
        {error && (
          <p 
            id={`${selectId}-error`} 
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
Select.displayName = 'Select';

export default Select;
