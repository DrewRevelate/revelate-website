"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FcGoogle } from 'react-icons/fc';
import { BsEnvelope, BsLock, BsShieldLock } from 'react-icons/bs';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Database } from '@/types/supabase';

interface AuthFormProps {
  view?: 'sign_in' | 'sign_up' | 'forgotten_password';
  redirectTo?: string;
}

const ModernAuthForm = ({ view = 'sign_in', redirectTo = '/dashboard' }: AuthFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check for error parameter in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user.email);
        router.push(redirectTo);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, redirectTo]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Error signing in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {error && (
        <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 rounded-lg shadow-soft-sm">
          <div className="flex items-center">
            <BsShieldLock className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleEmailSignIn} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
              <BsEnvelope className="w-4 h-4" />
            </div>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="pl-10 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
              Password
            </label>
            <Link 
              href="/auth/forgotten_password" 
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
              <BsLock className="w-4 h-4" />
            </div>
            <Input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg shadow-colored-md transition-all duration-200 transform hover:translate-y-[-1px]" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </div>
          ) : 'Sign in to Dashboard'}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <Button 
          type="button"
          variant="outline" 
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </Button>
      </form>
    </div>
  );
};

export default ModernAuthForm;
