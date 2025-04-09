"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { format, formatDistance } from 'date-fns';
import { supabase } from '@/lib/supabase/client';
import DashboardWidget from './DashboardWidget';
import { FiFolder } from 'react-icons/fi';

// Define project type from Supabase schema
import { Database } from '@/types/supabase';
type Project = Database['public']['Tables']['projects']['Row'];

export default function ProjectsWidget() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch recent projects
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(3);
        
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
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };

  return (
    <DashboardWidget
      title="Recent Projects"
      icon={<FiFolder className="mr-2 text-primary-500" aria-hidden="true" />}
      viewAllLink="/projects"
      isLoading={isLoading}
      error={error}
      isEmpty={projects.length === 0}
      emptyMessage="No active projects. Visit the Projects page to create one."
      onRetry={fetchProjects}
    >
      <div className="space-y-4">
        {projects.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="block p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {formatRelativeTime(project.updated_at)}
                </p>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {project.status}
              </span>
            </div>
            {project.completion_percentage != null && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{project.completion_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary-600 h-1.5 rounded-full"
                    style={{ width: `${project.completion_percentage}%` }}
                    aria-hidden="true"
                  ></div>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </DashboardWidget>
  );
}
