/**
 * Utility functions and constants for working with images
 */

// Common image sizes for consistency throughout the app
export const ImageSizes = {
  avatar: {
    xs: { width: 24, height: 24 },
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
    xl: { width: 64, height: 64 },
  },
  logo: {
    small: { width: 120, height: 32 },
    medium: { width: 180, height: 48 },
    large: { width: 240, height: 64 },
  },
  card: {
    thumbnail: { width: 300, height: 200 },
    square: { width: 400, height: 400 },
    portrait: { width: 400, height: 533 },
    landscape: { width: 400, height: 225 },
  },
  banner: {
    small: { width: 720, height: 240 },
    medium: { width: 1080, height: 360 },
    large: { width: 1920, height: 640 },
  },
};

// Generate responsive sizes attribute for Next.js Image component
export const generateResponsiveSizes = (
  mobileWidth = '100vw',
  tabletWidth = '50vw',
  desktopWidth = '33vw',
  largeDesktopWidth = '25vw'
) => {
  return `(max-width: 640px) ${mobileWidth}, (max-width: 1024px) ${tabletWidth}, (max-width: 1280px) ${desktopWidth}, ${largeDesktopWidth}`;
};

// Get image dimensions from URL (useful for dynamic images)
export async function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = (err) => {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

// Calculate aspect ratio for responsive sizing
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor} / ${height / divisor}`;
}

// Get image format from URL or src
export function getImageFormat(src: string): string {
  const extension = src.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'image/jpeg'; // Default fallback
  }
}
