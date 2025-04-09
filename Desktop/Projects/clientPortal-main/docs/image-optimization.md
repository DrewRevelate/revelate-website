# Image Optimization Documentation

## Overview

This document outlines the image optimization enhancements implemented in the Revelate Operations Client Portal. These improvements focus on leveraging Next.js Image capabilities to provide better performance, responsive design, and accessibility.

## Components Added

### 1. OptimizedImage Component

Located at: `/components/ui/Image/OptimizedImage.tsx`

This enhanced version of Next.js Image component includes:

- Proper error handling with fallback images
- Loading state management with placeholders
- Automatic responsive sizing
- Improved accessibility through better alt text
- Blur-up placeholder for better user experience during loading
- Support for both server and client components

Usage example:

```tsx
import { OptimizedImage } from '@/components/ui/Image';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Descriptive alt text for accessibility"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
  priority={false}
  quality={85}
  className="custom-class"
  containerClassName="container-class"
  loadingPlaceholder={<CustomLoadingComponent />}
/>
```

### 2. Avatar Component

Located at: `/components/ui/Avatar.tsx`

A specialized component for user avatars with:

- Optimized image loading
- Fallback to user initials or icon when image is unavailable
- Consistent sizing across application
- Proper accessibility
- Support for various sizes (xs, sm, md, lg, xl)

Usage example:

```tsx
import Avatar from '@/components/ui/Avatar';

<Avatar 
  src={user.avatar_url} 
  alt={user.full_name || user.email}
  size="md"
/>
```

### 3. ImageCard Component

Located at: `/components/ui/ImageCard.tsx`

A complete card component for document thumbnails, project images, etc:

- Standardized image display with proper optimization
- Support for different aspect ratios (square, video, portrait)
- Hover effects and actions
- Fallback icon display when no image is available
- Consistent layout and styling

Usage example:

```tsx
import ImageCard, { DefaultImageActions } from '@/components/ui/ImageCard';

<ImageCard
  src="/path/to/thumbnail.jpg"
  alt="Document title"
  title="Document title"
  description="Additional information"
  aspectRatio="square"
  actions={
    <>
      <DefaultImageActions.Download onClick={handleDownload} />
      <DefaultImageActions.Preview onClick={handlePreview} />
    </>
  }
  onClick={handleCardClick}
/>
```

## Utility Functions

Located at: `/lib/utils/imageUtils.ts`

- `ImageSizes`: Standard image dimensions for consistency
- `generateResponsiveSizes`: Helper for creating optimal sizes attribute
- `getImageDimensions`: Utility to detect dimensions from URLs
- `calculateAspectRatio`: Helper for responsive sizing
- `getImageFormat`: Utility to detect image format from paths

## Next.js Configuration Changes

Updates to `/next.config.js`:

- Added support for multiple image domains (Google avatars, GitHub avatars)
- Configured image formats (AVIF, WebP) for modern compression
- Optimized device and image size breakpoints
- Set proper cache TTL for images

## Implementation Examples

1. **Authentication Pages**: Updated with OptimizedImage for logos and illustrations
2. **Dashboard Layout**: Enhanced with Avatar component for user profiles
3. **Documents Page**: Implemented ImageCard for document thumbnails

## Best Practices for Images

1. **Always use the OptimizedImage component** instead of the standard Next.js Image or HTML img tags
2. **Provide descriptive alt text** that explains the image's purpose and content
3. **Use the sizes attribute** to ensure proper responsive loading
4. **Set priority=true** only for above-the-fold images visible on initial load
5. **Use appropriate quality settings**:
   - Use quality=85 for photos (good balance of quality vs size)
   - Use quality=90+ for logos and text-heavy images
   - Use quality=75-80 for thumbnails and decorative images
6. **Include image dimensions** to prevent layout shifts during loading
7. **Implement proper loading placeholders** for better user experience

## Performance Benefits

- Reduced initial page load time by serving properly sized images
- Decreased Cumulative Layout Shift (CLS) through dimension specification
- Improved Largest Contentful Paint (LCP) through prioritization
- Reduced bandwidth consumption with modern formats (WebP/AVIF)
- Enhanced caching through optimized cache headers
