import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaMoon, FaSun, FaBars, FaTimes, FaUser } from 'react-icons/fa';

// Placeholder hook for dark mode (will implement properly later)
const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for dark mode preference on initial load
    if (typeof window !== 'undefined') {
      const isDark = localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.theme = darkMode ? 'light' : 'dark';
  };

  return { darkMode, toggleDarkMode };
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const pathname = usePathname();

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Add event listener with passive for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    // Prevent body scrolling when menu is open
    if (!isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  // Check if a link is active
  const isLinkActive = (href: string) => {
    return pathname === href || 
      (href !== '/' && pathname?.startsWith(href));
  };

  // Close menu when clicking a link
  const handleLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 transition-all duration-200 ${
        scrolled ? 'shadow-soft-md py-2' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center" onClick={handleLinkClick}>
            <div className="flex items-center">
              <div className="relative h-8 w-8 mr-2">
                <Image 
                  src="/images/logo.png" 
                  alt="RevelateOps Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-lg font-display font-bold text-gray-900 dark:text-white">
                REVELATE
                <span className="text-primary-600 dark:text-primary-400">OPS</span>
              </span>
            </div>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/dashboard') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Dashboard
            </Link>
            <Link 
              href="/tasks" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/tasks') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Tasks
            </Link>
            <Link 
              href="/projects" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/projects') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Projects
            </Link>
            <Link 
              href="/meetings" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/meetings') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Meetings
            </Link>
            <Link 
              href="/documents" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/documents') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Documents
            </Link>
            <Link 
              href="/time-tracking" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/time-tracking') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Time
            </Link>
          </nav>
          
          {/* Right section */}
          <div className="flex items-center">
            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 focus:outline-none"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>
            
            {/* User dropdown - add proper user menu later */}
            <div className="ml-3 relative">
              <button 
                className="p-1 rounded-full bg-primary-100 text-primary-600 dark:bg-gray-800 dark:text-primary-400"
                aria-label="Open user menu"
              >
                <span className="sr-only">Open user menu</span>
                <FaUser className="h-6 w-6" />
              </button>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="ml-3 md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 focus:outline-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed inset-0 z-50 bg-gray-900/50 dark:bg-black/50 transition-opacity duration-200 
          ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      >
        <div 
          className={`fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-gray-900 p-6 overflow-y-auto transform transition-transform duration-300 
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-display font-bold dark:text-white">Menu</span>
            <button 
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-3">
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/dashboard') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Dashboard
            </Link>
            <Link 
              href="/tasks" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/tasks') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Tasks
            </Link>
            <Link 
              href="/projects" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/projects') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Projects
            </Link>
            <Link 
              href="/meetings" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/meetings') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Meetings
            </Link>
            <Link 
              href="/documents" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/documents') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Documents
            </Link>
            <Link 
              href="/time-tracking" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/time-tracking') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Time Tracking
            </Link>
            <Link 
              href="/settings" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isLinkActive('/settings') 
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={handleLinkClick}
            >
              Settings
            </Link>
            
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <button 
                onClick={toggleDarkMode}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 rounded-md"
              >
                {darkMode ? <FaSun className="mr-3 h-5 w-5" /> : <FaMoon className="mr-3 h-5 w-5" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              <button 
                className="mt-3 w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800 rounded-md"
                onClick={() => {
                  // Will implement logout here
                  console.log('Sign out');
                }}
              >
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
