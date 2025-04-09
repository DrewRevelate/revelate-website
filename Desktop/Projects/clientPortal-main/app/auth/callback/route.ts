import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error.message);
        // Redirect to sign in page with error message
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/signin?error=${encodeURIComponent(error.message)}`
        );
      }
      
      // Session established successfully, redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } catch (err) {
      console.error('Unexpected error in auth callback:', err);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/signin?error=${encodeURIComponent('An unexpected error occurred')}`
      );
    }
  }

  // No code provided, redirect to sign in
  return NextResponse.redirect(`${requestUrl.origin}/auth/signin`);
}
