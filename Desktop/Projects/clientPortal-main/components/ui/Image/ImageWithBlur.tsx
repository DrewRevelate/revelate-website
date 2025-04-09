"use client";

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithBlurProps extends Omit<ImageProps, 'onLoadingComplete'> {
  lowQualitySrc?: string;
}

/**
 * ImageWithBlur component that implements progressive image loading
 * Uses a low-quality placeholder image that transitions to the high-quality image
 * for improved perceived performance.
 */
export default function ImageWithBlur({
  src,
  alt,
  width,
  height,
  className,
  lowQualitySrc,
  placeholder = 'blur',
  ...props
}: ImageWithBlurProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined);

  // Generate a low-quality placeholder if not provided
  useEffect(() => {
    if (lowQualitySrc) {
      setBlurDataURL(lowQualitySrc);
    } else if (typeof src === 'string' && !blurDataURL) {
      // Create a lightweight blur placeholder (small colored box)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 10;
      canvas.height = 10;
      
      if (ctx) {
        ctx.fillStyle = '#e5e7eb'; // Light gray (matches Tailwind gray-200)
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        setBlurDataURL(canvas.toDataURL());
      }
    }
  }, [src, lowQualitySrc, blurDataURL]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "duration-700 ease-in-out",
          isLoading
            ? "scale-105 blur-sm grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
