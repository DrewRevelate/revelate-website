"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { supabase } from '@/lib/supabase/client';
import { BsEnvelope, BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

const ResetPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Error sending password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
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
            <h3 className="font-display font-semibold text-xl text-success-700 dark:text-success-300">Password reset email sent!</h3>
          </div>
          <p className="mb-6 text-success-600 dark:text-success-400">
            Check your email for instructions to reset your password. If you don't see it in your inbox, please check your spam folder.
          </p>
          <Button 
            type="button" 
            className="w-full bg-success-600 hover:bg-success-700 text-white font-medium py-2.5 rounded-lg shadow-colored-md transition-all duration-200 transform hover:translate-y-[-1px]"
            onClick={() => router.push('/auth/signin')}
          >
            Return to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter the email associated with your account, and we'll send you instructions to reset your password.
            </p>
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
                Sending...
              </div>
            ) : 'Send Reset Instructions'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm;
