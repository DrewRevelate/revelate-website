"use client";

import { Suspense, lazy } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layout/Dashboard';
import ResponsiveGrid from '@/components/layout/ResponsiveGrid';
import PageHeader from '@/components/layout/PageHeader';
import ErrorBoundary from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';
import { 
  FiLoader, 
  FiBarChart2, 
  FiAlertCircle, 
  FiFileText, 
  FiClock
} from 'react-icons/fi';

// Dynamically import widget components with code splitting
const ProjectsWidget = lazy(() => import('@/components/dashboard/ProjectsWidget'));
const TasksWidget = lazy(() => import('@/components/dashboard/TasksWidget'));
const MeetingsWidget = lazy(() => import('@/components/dashboard/MeetingsWidget'));
const DocumentsWidget = lazy(() => import('@/components/dashboard/DocumentsWidget'));

// Import types from Supabase database schema
import { Database } from '@/types/supabase';

// Import widget skeleton for loading state
import WidgetSkeleton from '@/components/dashboard/WidgetSkeleton';

// Define types from Supabase schema
type Document = Database['public']['Tables']['documents']['Row'];
type TimePackage = Database['public']['Tables']['time_packages']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

// Import remaining widget components
import { SkeletonLoader, ErrorMessage } from '@/components/dashboard/DashboardWidget';

// Dashboard component with optimized loading
export default function Dashboard() {
  // Get authenticated user and loading state
  const { user, isLoading: authLoading } = useAuth();

  return (
    <DashboardLayout>
      {authLoading ? (
        <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
          <div className="text-center">
            <FiLoader className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              This should only take a moment
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Welcome Header */}
          <PageHeader
            title={`Welcome to your Client Portal${user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}`}
            subtitle="Track your projects, manage tasks, schedule meetings, and access important documents all in one place."
            background="gradient"
            padding="large"
            marginBottom="medium"
            headingId="welcome-heading"
            className="shadow-md"
          />
=======
          
          {/* Dashboard Grid */}
          <ResponsiveGrid mobileCols={1} tabletCols={2} desktopCols={3} gap={6}>
            {/* Projects Widget - Lazy loaded with Suspense and Error Boundary */}
            <Suspense fallback={
              <WidgetSkeleton 
                icon={<FiFolder className="mr-2 text-primary-500" aria-hidden="true" />}
                title="Recent Projects"
              />
            }>
              <ErrorBoundary>
                <ProjectsWidget />
              </ErrorBoundary>
            </Suspense>
            
            {/* Tasks Widget - Lazy loaded with Suspense and Error Boundary */}
            <Suspense fallback={
              <WidgetSkeleton 
                icon={<FiCheckSquare className="mr-2 text-primary-500" aria-hidden="true" />}
                title="Upcoming Tasks"
              />
            }>
              <ErrorBoundary>
                <TasksWidget />
              </ErrorBoundary>
            </Suspense>
            
            {/* Meetings Widget - Lazy loaded with Suspense and Error Boundary */}
            <Suspense fallback={
              <WidgetSkeleton 
                icon={<FiCalendar className="mr-2 text-primary-500" aria-hidden="true" />}
                title="Upcoming Meetings"
              />
            }>
              <ErrorBoundary>
                <MeetingsWidget />
              </ErrorBoundary>
            </Suspense>
            
            {/* Documents Widget - Lazy loaded with Suspense and Error Boundary */}
            <Suspense fallback={
              <WidgetSkeleton 
                icon={<FiFileText className="mr-2 text-primary-500" aria-hidden="true" />}
                title="Recent Documents"
              />
            }>
              <ErrorBoundary>
                <DocumentsWidget />
              </ErrorBoundary>
            </Suspense>
            
            {/* Time Tracking Widget will be implemented in the next phase */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold flex items-center">
                  <FiClock className="mr-2 text-primary-500" aria-hidden="true" />
                  <span className="ml-2">Time Tracking</span>
                </h2>
                <a href="/time-tracking" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                  View All
                </a>
              </div>
              <div className="p-4 text-center py-4 text-gray-500 dark:text-gray-400">
                Time tracking data is being optimized for better performance.
              </div>
            </div>
            
            {/* Notifications Widget will be implemented in the next phase */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold flex items-center">
                  <FiAlertCircle className="mr-2 text-primary-500" aria-hidden="true" />
                  <span className="ml-2">Notifications</span>
                </h2>
              </div>
              <div className="p-4 text-center py-4 text-gray-500 dark:text-gray-400">
                You're all caught up! No new notifications.
              </div>
            </div>
          </ResponsiveGrid>
        </>
      )}
    </DashboardLayout>
  );
}
