"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { supabase } from '@/lib/supabase/client';
import { BsShieldLock, BsLock, BsExclamationCircle, BsCheckCircle } from 'react-icons/bs';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if we have a session that needs password update
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // No active session
        setError('The password reset link has expired or is invalid. Please request a new password reset link.');
      }
    };

    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ 
        password 
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side with brand and illustration */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-md mx-auto text-center space-y-8 relative z-10">
          <div className="mb-6">
            <Image
              src="/logo-white.svg"
              alt="RevelateOps Logo"
              width={200}
              height={60}
              priority
              className="mx-auto"
            />
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-white/10 blur-xl rounded-full"></div>
            <Image
              src="/auth-illustration.svg" 
              alt="Data visualization illustration"
              width={380}
              height={280}
              className="mx-auto relative z-10"
            />
          </div>
          
          <h2 className="text-3xl font-display font-semibold mt-6">Create a New Password</h2>
          <p className="text-white/80 max-w-sm mx-auto text-lg">
            Set a secure password to protect your account and access your client portal.
          </p>
        </div>
      </div>

      {/* Right side with password reset form */}
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo for small screens */}
          <div className="text-center lg:hidden mb-8">
            <Link href="/">
              <div className="inline-block">
                <Image
                  src="/logo.svg"
                  alt="RevelateOps Logo"
                  width={180}
                  height={48}
                  priority
                />
              </div>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Create a new password for your account
            </p>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft-lg">
            {error && (
              <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 rounded-lg shadow-soft-sm">
                <div className="flex items-center">
                  <BsExclamationCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            {success ? (
              <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 text-success-700 dark:text-success-300 rounded-lg p-6 shadow-soft-md">
                <div className="flex items-center mb-4">
                  <div className="bg-success-100 dark:bg-success-800 rounded-full p-2 mr-4">
                    <BsCheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-success-700 dark:text-success-300">Password updated!</h3>
                </div>
                <p className="mb-6 text-success-600 dark:text-success-400">
                  Your password has been successfully updated. You can now sign in with your new password.
                </p>
                <Button 
                  type="button" 
                  className="w-full bg-success-600 hover:bg-success-700 text-white font-medium py-2.5 rounded-lg shadow-colored-md transition-all duration-200 transform hover:translate-y-[-1px]"
                  onClick={() => router.push('/auth/signin')}
                >
                  Go to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                    New Password
                  </label>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password must be at least 6 characters long.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
                      <BsShieldLock className="w-4 h-4" />
                    </div>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Updating...
                    </div>
                  ) : 'Update Password'}
                </Button>
              </form>
            )}
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link 
                href="/auth/signin" 
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        <footer className="w-full max-w-md text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} RevelateOps. All rights reserved.</p>
        </footer>
      </div>
      
      {/* Add CSS for background pattern */}
      <style jsx global>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
