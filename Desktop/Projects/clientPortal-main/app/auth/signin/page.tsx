"use client";

import { OptimizedImage } from '@/components/ui/Image';
import Link from 'next/link';
import ModernAuthForm from '@/components/auth/ModernAuthForm';

export default function SignIn() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side with brand and illustration */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-md mx-auto text-center space-y-8 relative z-10">
          <div className="mb-6">
            <OptimizedImage
              src="/logo-white.svg"
              alt="RevelateOps Logo"
              width={200}
              height={60}
              priority
              className="mx-auto"
              sizes="200px"
            />
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-white/10 blur-xl rounded-full"></div>
            <OptimizedImage
              src="/auth-illustration.svg" 
              alt="Data visualization illustration showing analytics graphs and charts"
              width={400}
              height={300}
              className="mx-auto relative z-10"
              sizes="(max-width: 768px) 100vw, 400px"
              quality={90}
            />
          </div>
          
          <h2 className="text-3xl font-display font-semibold mt-6">Transform Your Data Journey</h2>
          <p className="text-white/80 max-w-sm mx-auto text-lg">
            Access insights, manage projects, and leverage data-driven solutions to accelerate your business growth.
          </p>
          
          {/* Client testimonial */}
          <div className="mt-10 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-colored-lg">
            <p className="italic text-white/90 mb-4">
              "RevelateOps has transformed how we make decisions. Their data insights directly contributed to our 32% revenue growth this year."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center mr-3 shadow-colored-sm">
                <span className="font-bold">JD</span>
              </div>
              <div className="text-left">
                <p className="font-medium">Jane Doe</p>
                <p className="text-sm text-white/70">CEO, Example Company</p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-primary-400/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary-300/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo for small screens */}
          <div className="text-center lg:hidden mb-8">
            <Link href="/">
              <div className="inline-block">
                <OptimizedImage
                  src="/logo.svg"
                  alt="RevelateOps Logo"
                  width={180}
                  height={48}
                  priority
                  sizes="180px"
                  className="w-auto h-auto"
                />
              </div>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Sign in to access your client portal
            </p>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft-lg">
            <ModernAuthForm view="sign_in" />
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Contact us
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
