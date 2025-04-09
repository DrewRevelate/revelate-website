"use client";

import React from 'react';
import { OptimizedImage } from '@/components/ui/Image';
import { cn } from '@/lib/utils';
import { FiFileText, FiDownload, FiEye } from 'react-icons/fi';

interface ImageCardProps {
  src?: string;
  alt: string;
  title: string;
  description?: string;
  className?: string;
  imageClassName?: string;
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait';
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

/**
 * ImageCard component for display images with title and description
 * Useful for documents, project thumbnails, or any card-based image display
 */
export default function ImageCard({
  src,
  alt,
  title,
  description,
  className,
  imageClassName,
  aspectRatio = 'square',
  actions,
  icon,
  onClick,
}: ImageCardProps) {
  // Define aspect ratio styles
  const aspectRatioMap = {
    auto: {},
    square: { aspectRatio: '1 / 1' },
    video: { aspectRatio: '16 / 9' },
    portrait: { aspectRatio: '3 / 4' },
  };

  // Build image dimensions
  const imageWidth = 400;
  const imageHeight = aspectRatio === 'square' ? 400 : 
                       aspectRatio === 'video' ? 225 : 
                       aspectRatio === 'portrait' ? 533 : 300;

  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200",
        "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Image container */}
      <div 
        className="relative bg-gray-100 dark:bg-gray-900 overflow-hidden"
        style={aspectRatioMap[aspectRatio]}
      >
        {src ? (
          <OptimizedImage
            src={src}
            alt={alt}
            width={imageWidth}
            height={imageHeight}
            className={cn(
              "object-cover w-full h-full transition-transform duration-500",
              "hover:scale-105",
              imageClassName
            )}
            sizes={`(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            {icon || <FiFileText className="h-12 w-12 text-gray-400 dark:text-gray-500" />}
          </div>
        )}
        
        {/* Hover overlay with actions if provided */}
        {actions && (
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3 duration-300">
            {actions}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// Export default actions for convenience
export const DefaultImageActions = {
  Download: ({ onClick }: { onClick?: () => void }) => (
    <button 
      onClick={onClick} 
      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-800"
      aria-label="Download file"
    >
      <FiDownload className="h-5 w-5" />
    </button>
  ),
  Preview: ({ onClick }: { onClick?: () => void }) => (
    <button 
      onClick={onClick} 
      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-800"
      aria-label="Preview file"
    >
      <FiEye className="h-5 w-5" />
    </button>
  )
};
