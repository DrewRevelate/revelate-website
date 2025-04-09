"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Confirming your email...');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get token and type from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid confirmation link. Please request a new one.');
          return;
        }
        
        if (type === 'signup') {
          // Handle email confirmation for signup
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });
          
          if (error) {
            console.error('Error confirming email:', error);
            setStatus('error');
            setMessage(error.message || 'Failed to confirm your email. Please try again.');
          } else {
            setStatus('success');
            setMessage('Your email has been confirmed! Redirecting you to the dashboard...');
            // Redirect to dashboard after a delay
            setTimeout(() => {
              router.push('/dashboard');
            }, 3000);
          }
        } else if (type === 'recovery') {
          // Handle password recovery
          setStatus('success');
          setMessage('You can now reset your password.');
          // Redirect to reset password page
          router.push(`/auth/reset-password?token=${token}`);
        } else {
          setStatus('error');
          setMessage('Unknown confirmation type.');
        }
      } catch (error) {
        console.error('Unexpected error during confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again later.');
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md mb-8">
        <div className="text-center mb-8">
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
          
          <div className="mt-10 flex flex-col items-center">
            {status === 'loading' && (
              <FiLoader className="animate-spin h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
            )}
            
            {status === 'success' && (
              <FiCheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
            )}
            
            {status === 'error' && (
              <FiAlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
            )}
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {status === 'loading' && 'Confirming Email'}
              {status === 'success' && 'Email Confirmed'}
              {status === 'error' && 'Confirmation Failed'}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {message}
            </p>
            
            {status === 'error' && (
              <Link 
                href="/auth/signin"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Back to Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <footer className="w-full max-w-md text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} RevelateOps. All rights reserved.</p>
      </footer>
    </div>
  );
}
