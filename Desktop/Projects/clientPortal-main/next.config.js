/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enable compiler optimizations
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Optimize performance
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles
  experimental: {
    // Advanced optimizations
    optimizeCss: true,
    optimisticClientCache: true,
    serverMinification: true,
    nextScriptWorkers: true,
  },
  images: {
    domains: ['ynkuozdffpsogpziaize.supabase.co', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ynkuozdffpsogpziaize.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600, // Increase cache time to 1 hour
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true, // Allow SVG optimization
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: process.env.NODE_ENV === 'development', // Only optimize in production
  },
  // Add transpilePackages if needed for external modules
  // transpilePackages: ['@supabase/auth-ui-react', '@supabase/auth-ui-shared']
};

module.exports = nextConfig;
