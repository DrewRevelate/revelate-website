import Image from 'next/image';
import Link from 'next/link';

export default function SignUp() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side with brand and illustration */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-primary-600 text-white">
        <div className="max-w-md mx-auto text-center space-y-8">
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
          
          <Image
            src="/auth-illustration.svg" 
            alt="Data visualization illustration"
            width={400}
            height={300}
            className="mx-auto"
          />
          
          <h2 className="text-3xl font-medium">Transform Your Data Journey</h2>
          <p className="text-white/80 max-w-sm mx-auto">
            Access your personalized client portal to manage projects, track tasks, and leverage data-driven insights for your business growth.
          </p>
          
          {/* Client testimonial */}
          <div className="mt-10 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="italic text-white/90 mb-4">
              "RevelateOps has transformed how we make decisions. Their data insights directly contributed to our 32% revenue growth this year."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center mr-3">
                <span className="font-bold">JD</span>
              </div>
              <div className="text-left">
                <p className="font-medium">Jane Doe</p>
                <p className="text-sm text-white/70">CEO, Example Company</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with signup info */}
      <div className="flex flex-col items-center justify-center p-8">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Get Started with RevelateOps
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Contact our team to set up your client portal
            </p>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personalized Onboarding</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">We'll guide you through the setup process and customize the portal to your specific needs.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Secure Access</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Your data is protected with enterprise-grade security and role-based access controls.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Data-Driven Insights</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Access powerful analytics and visualizations to drive your business decisions.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <a 
                href="mailto:contact@revelateops.com" 
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-md text-center"
              >
                Contact Sales Team
              </a>
            </div>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
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
    </div>
  );
}
