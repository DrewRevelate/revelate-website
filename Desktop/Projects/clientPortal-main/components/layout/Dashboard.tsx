"use client";

import { ReactNode, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SkipToContent from '@/components/a11y/SkipToContent';
import PageLoadingIndicator from '@/components/a11y/PageLoadingIndicator';
import { FocusTrap } from '@/components/a11y';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { 
  FiHome, 
  FiFolder, 
  FiCheckSquare, 
  FiCalendar, 
  FiFileText,
  FiClock,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiBell,
  FiMoon,
  FiSun,
  FiUserCheck,
  FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '@/lib/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMounting, setIsMounting] = useState(true);
  const { signOut, user } = useAuth();
  
  const navigationItems: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: FiHome,
      description: 'Overview of your projects, tasks, and activities'
    },
    { 
      name: 'Projects', 
      href: '/projects', 
      icon: FiFolder,
      description: 'View and manage your active and completed projects'
    },
    { 
      name: 'Tasks', 
      href: '/tasks', 
      icon: FiCheckSquare,
      description: 'Track deliverables and assigned tasks'
    },
    { 
      name: 'Meetings', 
      href: '/meetings', 
      icon: FiCalendar,
      description: 'Schedule and join project meetings'
    },
    { 
      name: 'Documents', 
      href: '/documents', 
      icon: FiFileText,
      description: 'Access project documents and files'
    },
    { 
      name: 'Time Tracking', 
      href: '/time-tracking', 
      icon: FiClock,
      description: 'View time spent on your projects'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: FiSettings,
      description: 'Manage account preferences'
    },
  ];

  // Initialize theme from user preference or system preference
  useEffect(() => {
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(isDark);
    
    // Apply theme
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setIsMounting(false);
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      
      // Update DOM
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Save preference
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      return newMode;
    });
  }, []);

  // Toggle mobile menu and trap focus when open
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    // Close profile menu if open
    setIsProfileMenuOpen(false);
  }, []);
  
  // Toggle profile menu
  const toggleProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(prev => !prev);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
  };
  
  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isProfileMenuOpen) {
        const profileMenu = document.getElementById('profile-menu');
        const profileButton = document.getElementById('profile-button');
        
        if (profileMenu && 
            profileButton && 
            !profileMenu.contains(event.target as Node) && 
            !profileButton.contains(event.target as Node)) {
          setIsProfileMenuOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isProfileMenuOpen]);

  // Don't render content during initial mount to prevent flash
  if (isMounting) {
    return <div className="h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <SkipToContent />
        {/* Sidebar - Desktop */}
        <aside 
          className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" aria-label="Go to dashboard">
              <div className="flex items-center">
                <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                  RevelateOps
                </span>
              </div>
            </Link>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href || pathname?.startsWith(item.href + '/') 
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400" 
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
                title={item.description}
              >
                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleDarkMode}
              className="flex items-center w-full px-4 py-2 mb-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <>
                  <FiSun className="mr-3 h-5 w-5" aria-hidden="true" />
                  Light Mode
                </>
              ) : (
                <>
                  <FiMoon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Dark Mode
                </>
              )}
            </button>
            
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Sign out of your account"
            >
              <FiLogOut className="mr-3 h-5 w-5" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden fixed top-0 left-0 z-20 m-4">
          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-md"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="h-6 w-6" aria-hidden="true" />
            ) : (
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-10 bg-gray-900 bg-opacity-50"
            aria-modal="true"
            role="dialog"
            aria-labelledby="mobile-menu-title"
          >
            <FocusTrap isActive={isMobileMenuOpen}>
              <div 
                id="mobile-menu"
                className="relative w-64 h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
              >
                <h2 id="mobile-menu-title" className="sr-only">Mobile navigation menu</h2>
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                <Link href="/dashboard" onClick={toggleMobileMenu}>
                  <div className="flex items-center">
                    <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                      RevelateOps
                    </span>
                  </div>
                </Link>
                <button 
                  onClick={toggleMobileMenu}
                  aria-label="Close navigation menu"
                >
                  <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                </button>
              </div>
              
              <nav className="px-2 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={toggleMobileMenu}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === item.href || pathname?.startsWith(item.href + '/') 
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400" 
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
                
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center w-full px-4 py-2 mt-4 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <>
                      <FiSun className="mr-3 h-5 w-5" aria-hidden="true" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <FiMoon className="mr-3 h-5 w-5" aria-hidden="true" />
                      Dark Mode
                    </>
                  )}
                </button>
              </nav>
              
              <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label="Sign out of your account"
                >
                  <FiLogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </FocusTrap>
          </div>
        )}

        {/* Page loading indicator */}
        <PageLoadingIndicator />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navigation */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <h1 className="text-lg font-medium md:hidden">
                RevelateOps Portal
              </h1>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button 
                  className="p-1 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="View notifications"
                >
                  <span className="relative inline-block">
                    <FiBell className="h-6 w-6" aria-hidden="true" />
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                  </span>
                </button>
                
                {/* Theme toggle (tablet/mobile) */}
                <button 
                  onClick={toggleDarkMode} 
                  className="p-1 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <FiSun className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FiMoon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
                
                {/* Profile dropdown */}
                <div className="relative">
                  <button 
                    id="profile-button"
                    onClick={toggleProfileMenu}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center">
                      <Avatar 
                        src={user?.user_metadata?.avatar_url} 
                        alt={user?.user_metadata?.full_name || user?.email || 'User'}
                        size="sm"
                      />
                      <span className="hidden sm:flex sm:items-center ml-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                        </span>
                        <FiChevronDown 
                          className={cn(
                            "ml-1 h-4 w-4 text-gray-400 transition-transform duration-200",
                            isProfileMenuOpen ? "transform rotate-180" : ""
                          )} 
                          aria-hidden="true" 
                        />
                      </span>
                    </div>
                  </button>
                  
                  {/* Profile dropdown menu */}
                  {isProfileMenuOpen && (
                    <FocusTrap isActive={isProfileMenuOpen}>
                      <div 
                        id="profile-menu"
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="profile-button"
                      >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                          {user?.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/settings/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <FiUserCheck className="mr-3 h-4 w-4" aria-hidden="true" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <FiSettings className="mr-3 h-4 w-4" aria-hidden="true" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <FiLogOut className="mr-3 h-4 w-4" aria-hidden="true" />
                        Sign out
                      </button>
                      </div>
                    </FocusTrap>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main 
            className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 focus:outline-none"
            tabIndex={-1}
            id="main-content"
          >
            {/* Breadcrumbs */}
            <Breadcrumbs className="mb-4" />
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
