"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/Dashboard';
import Link from 'next/link';
import { FiPlus, FiFilter, FiSearch, FiLoader, FiFolder } from 'react-icons/fi';
import PageHeader from '@/components/layout/PageHeader';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';

// Define status type to match the keys in statusColors
type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';

import { Database } from '@/types/supabase';

// Define project type from Supabase schema
type Project = Database['public']['Tables']['projects']['Row'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Set up real-time subscription for projects
  const { error: realtimeError } = useSupabaseRealtime({
    table: 'projects',
    onChange: (payload) => {
      if (payload.eventType === 'INSERT') {
        setProjects(prev => [payload.new as Project, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setProjects(prev => 
          prev.map(project => 
            project.id === payload.new.id ? { ...project, ...payload.new } : project
          )
        );
      } else if (payload.eventType === 'DELETE') {
        setProjects(prev => 
          prev.filter(project => project.id !== payload.old.id)
        );
      }
    }
  });
  
  // If there's an error with the real-time subscription, log it
  useEffect(() => {
    if (realtimeError) {
      console.error('Error with real-time subscription:', realtimeError);
    }
  }, [realtimeError]);

  // Fetch projects from Supabase
  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProjects(data || []);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to fetch projects');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Filter projects based on search term
  const filteredProjects = searchTerm
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : projects;

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Status badge colors
  const statusColors: Record<ProjectStatus, string> = {
    'Planning': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'On Hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <PageHeader
        title="Projects"
        subtitle="View and manage your ongoing projects"
        icon={<FiFolder className="h-6 w-6 text-primary-500" />}
        background="light"
        actions={
          <>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search projects"
              />
            </div>
            <button
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-label="Filter projects"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <Link 
              href="/projects/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              aria-label="Create new project"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </>
        }
      />

      {/* Projects list */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <FiLoader className="animate-spin h-8 w-8 mx-auto text-primary-600" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Error</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProjects.map((project) => (
              <div key={project.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {project.name}
                      </h2>
                      <span className={`ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[project.status as ProjectStatus] || statusColors['Planning']}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {project.description || 'No description provided'}
                    </p>
                    <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Start:</span> {formatDate(project.start_date)}
                      </div>
                      <div>
                        <span className="font-medium">Target End:</span> {formatDate(project.target_end_date)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                    <div className="text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {project.completion_percentage}% Complete
                    </div>
                    <div className="mt-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${project.completion_percentage}%` }}
                      ></div>
                    </div>
                    <Link 
                      href={`/projects/${project.id}`}
                      className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Get started by creating a new project.
            </p>
            <div className="mt-6">
              <Link 
                href="/projects/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
