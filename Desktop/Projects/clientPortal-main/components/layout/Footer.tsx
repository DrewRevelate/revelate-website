import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} RevelateOps. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              href="https://revelateops.com/privacy" 
              target="_blank" 
              className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              Privacy Policy
            </Link>
            <Link 
              href="https://revelateops.com/terms" 
              target="_blank" 
              className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              Terms of Service
            </Link>
            <Link 
              href="https://revelateops.com/contact" 
              target="_blank" 
              className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
