"use client";

import Image from 'next/image';
import Link from 'next/link';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ForgottenPassword() {
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
          
          <h2 className="text-3xl font-display font-semibold mt-6">Reset Your Password</h2>
          <p className="text-white/80 max-w-sm mx-auto text-lg">
            We'll send you instructions to reset your password and get you back to accessing your client portal quickly.
          </p>
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-primary-400/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary-300/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Right side with reset form */}
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
              Forgot Your Password?
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Enter your email and we'll send you password reset instructions
            </p>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft-lg">
            <ResetPasswordForm />
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
