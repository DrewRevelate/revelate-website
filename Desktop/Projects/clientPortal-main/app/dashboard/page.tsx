import { Metadata } from 'next';
import DashboardLayout from '@/components/layout/Dashboard';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { Database } from '@/types/supabase';

// Define types from Supabase schema
type Document = Database['public']['Tables']['documents']['Row'];
type TimePackage = Database['public']['Tables']['time_packages']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

// Define metadata for the dashboard page
export const metadata: Metadata = {
  title: 'Dashboard | RevelateOps Client Portal',
  description: 'Track your projects, manage tasks, schedule meetings, and access important documents all in one place.',
};

// Server component for the dashboard page
export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardClient />
    </DashboardLayout>
  );
}
