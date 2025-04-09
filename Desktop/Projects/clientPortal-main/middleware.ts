import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes are public and which need authentication
const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/callback',
  '/auth/confirm',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Get the current path
  const path = req.nextUrl.pathname;
  
  // Allow all auth routes without checking session
  if (publicRoutes.some(route => path.startsWith(route))) {
    return res;
  }
  
  // For API routes, handle authentication in the route handlers
  if (path.startsWith('/api')) {
    return res;
  }

  // Check if the user is authenticated
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // If the user is not authenticated and not on a public route, redirect to login
    if (!session && !publicRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    
    // If user is accessing the root path, redirect to dashboard if authenticated
    if (path === '/' && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } catch (error) {
    console.error('Middleware auth error:', error);
    // If there's an error checking authentication, redirect to login
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  
  return res;
}

// Specify which routes this middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
