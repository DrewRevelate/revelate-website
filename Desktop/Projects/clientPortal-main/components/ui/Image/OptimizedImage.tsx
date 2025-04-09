"use client";

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  containerClassName?: string;
  loadingPlaceholder?: React.ReactNode;
  eager?: boolean;
  srcSet?: string[];
  artDirectedSources?: {
    media: string;
    srcSet: string[];
    type?: string;
  }[];
}

/**
 * OptimizedImage is an enhanced version of Next.js Image component with:
 * - Proper error handling with fallback
 * - Loading state handling
 * - Blur placeholder for better UX during loading
 * - Automatic responsive sizing
 * - Container className for positioning
 * - Support for modern image formats (WebP, AVIF)
 * - Art-directed responsive images
 * - Lazy loading with IntersectionObserver
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes,
  quality = 85,
  priority = false,
  fallbackSrc = '/placeholder.svg',
  className,
  containerClassName,
  style,
  loadingPlaceholder,
  eager = false,
  srcSet,
  artDirectedSources,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority && !eager);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority || eager);
  
  // Generate responsive sizes if not provided
  const defaultSizes = sizes || 
    '(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 33vw';

  // Handle image load complete
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Handle image load error
  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (priority || eager || isVisible) return;

    const element = document.getElementById(`image-${alt?.replace(/\s+/g, '-')}`);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when image is 200px from viewport
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [alt, priority, eager, isVisible]);

  // Render loading placeholder if provided and image is loading
  if ((isLoading || !isVisible) && loadingPlaceholder) {
    return (
      <div className={containerClassName} id={`image-${alt?.replace(/\s+/g, '-')}`}>
        {loadingPlaceholder}
      </div>
    );
  }

  // Add additional image attributes for performance
  const imageProps: any = {
    fetchPriority: priority ? 'high' : eager ? 'auto' : 'low',
    decoding: priority ? 'sync' : 'async',
    loading: priority ? 'eager' : 'lazy',
  };

  return (
    <div 
      className={cn("relative overflow-hidden", containerClassName)}
      id={`image-${alt?.replace(/\s+/g, '-')}`}
    >
      {isVisible && (
        <>
          {/* Art-directed images with <picture> for responsive design */}
          {artDirectedSources && artDirectedSources.length > 0 ? (
            <picture>
              {/* Add sources for different screen sizes and formats */}
              {artDirectedSources.map((source, index) => (
                <source
                  key={`${index}-${source.media}`}
                  media={source.media}
                  srcSet={source.srcSet.join(', ')}
                  type={source.type || 'image/webp'}
                />
              ))}
              
              {/* Add AVIF source if available */}
              {srcSet && srcSet.length > 0 && (
                <>
                  <source
                    type="image/avif"
                    srcSet={srcSet.map(s => s.replace(/\.(jpg|jpeg|png|webp)$/, '.avif')).join(', ')}
                    sizes={defaultSizes}
                  />
                  <source
                    type="image/webp"
                    srcSet={srcSet.map(s => s.replace(/\.(jpg|jpeg|png)$/, '.webp')).join(', ')}
                    sizes={defaultSizes}
                  />
                </>
              )}
              
              {/* Fallback to Next.js Image component */}
              <Image
                src={error ? fallbackSrc : src}
                alt={alt}
                width={width}
                height={height}
                quality={quality}
                priority={priority}
                sizes={defaultSizes}
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                  "transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100",
                  className
                )}
                style={{
                  objectFit: 'contain',
                  ...style,
                }}
                {...imageProps}
                {...props}
              />
            </picture>
          ) : (
            <Image
              src={error ? fallbackSrc : src}
              alt={alt}
              width={width}
              height={height}
              quality={quality}
              priority={priority}
              sizes={defaultSizes}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                "transition-opacity duration-300",
                isLoading ? "opacity-0" : "opacity-100",
                className
              )}
              style={{
                objectFit: 'contain',
                ...style,
              }}
              {...imageProps}
              {...props}
            />
          )}
          
          {/* Show skeleton loader while image is loading */}
          {isLoading && !loadingPlaceholder && (
            <div 
              aria-hidden="true"
              className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"
              style={{ width, height }}
            ></div>
          )}
        </>
      )}
      
      {/* Placeholder for not-yet-visible images */}
      {!isVisible && !loadingPlaceholder && (
        <div 
          aria-hidden="true"
          className="bg-gray-200 dark:bg-gray-700 rounded-md"
          style={{ width, height }}
        ></div>
      )}
    </div>
  );
}
