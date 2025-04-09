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
 * - Performance optimizations for Core Web Vitals
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
  
  // Generate a unique ID based on alt text or a random number if alt is missing
  const imageId = `image-${alt?.replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 9)}`;

  // Handle image load complete
  const handleLoad = () => {
    setIsLoading(false);
    
    // Send Core Web Vitals metric to analytics
    if (window.performance && 'measure' in window.performance) {
      try {
        window.performance.measure(`image-load-${imageId}`, `image-start-${imageId}`);
      } catch (e) {
        // Measurement may fail if the start mark doesn't exist
        console.debug('Performance measurement error:', e);
      }
    }
  };

  // Handle image load error
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    
    // Log error for monitoring
    console.error(`Failed to load image: ${src}`);
  };

  // Performance mark when component mounts
  useEffect(() => {
    if (window.performance && 'mark' in window.performance) {
      window.performance.mark(`image-start-${imageId}`);
    }
  }, [imageId]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (priority || eager || isVisible) return;

    const element = document.getElementById(imageId);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
          
          // Performance mark when image becomes visible
          if (window.performance && 'mark' in window.performance) {
            window.performance.mark(`image-visible-${imageId}`);
          }
        }
      },
      { 
        rootMargin: '200px', // Start loading when image is 200px from viewport
        threshold: 0.01 // Trigger when at least 1% of the image is visible
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [imageId, priority, eager, isVisible]);

  // Render loading placeholder if provided and image is loading
  if ((isLoading || !isVisible) && loadingPlaceholder) {
    return (
      <div className={containerClassName} id={imageId}>
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

  // Calculate aspect ratio for layout stability
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  return (
    <div 
      className={cn("relative overflow-hidden", containerClassName)}
      id={imageId}
      style={aspectRatio ? { ...style, aspectRatio } : style}
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
                  sizes={defaultSizes}
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
              role="presentation"
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
          role="presentation"
        ></div>
      )}
    </div>
  );
}
