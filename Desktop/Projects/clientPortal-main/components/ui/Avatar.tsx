"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FiUser } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
}

/**
 * Avatar component with proper image optimization and fallback
 */
export default function Avatar({
  src,
  alt,
  size = 'md',
  className,
  fallbackClassName
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  
  // Define size dimensions
  const sizeMap = {
    xs: { width: 24, height: 24, iconSize: 12, textSize: 'text-xs' },
    sm: { width: 32, height: 32, iconSize: 16, textSize: 'text-sm' },
    md: { width: 40, height: 40, iconSize: 20, textSize: 'text-base' },
    lg: { width: 48, height: 48, iconSize: 24, textSize: 'text-lg' },
    xl: { width: 64, height: 64, iconSize: 32, textSize: 'text-xl' },
  };
  
  const { width, height, iconSize, textSize } = sizeMap[size];
  
  // Extract initials from alt text
  const getInitials = () => {
    if (!alt) return '';
    return alt
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  // Determine if we should show the image
  const showImage = src && !hasError;
  
  return (
    <div 
      className={cn(
        "relative flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-full overflow-hidden",
        "flex items-center justify-center text-primary-600 dark:text-primary-400",
        className
      )}
      style={{ width, height }}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-cover"
          onError={() => setHasError(true)}
          sizes={`${width}px`}
          priority={size === 'lg' || size === 'xl'}
        />
      ) : (
        <div className={cn("w-full h-full flex items-center justify-center", fallbackClassName)}>
          {alt ? (
            <span className={cn("font-medium", textSize)}>{getInitials()}</span>
          ) : (
            <FiUser style={{ width: iconSize, height: iconSize }} />
          )}
        </div>
      )}
    </div>
  );
}
