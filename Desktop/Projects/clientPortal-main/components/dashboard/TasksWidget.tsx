"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase/client';
import DashboardWidget from './DashboardWidget';
import { FiCheckSquare } from 'react-icons/fi';

// Define task type from Supabase schema
import { Database } from '@/types/supabase';
type Task = Database['public']['Tables']['tasks']['Row'];

export default function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch upcoming tasks
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true })
        .limit(3);
        
      if (error) {
        throw error;
      }
      
      setTasks(data || []);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date set';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <DashboardWidget
      title="Upcoming Tasks"
      icon={<FiCheckSquare className="mr-2 text-primary-500" aria-hidden="true" />}
      viewAllLink="/tasks"
      isLoading={isLoading}
      error={error}
      isEmpty={tasks.length === 0}
      emptyMessage="No upcoming tasks. All caught up!"
      onRetry={fetchTasks}
    >
      <div className="space-y-3">
        {tasks.map((task) => (
          <Link
            href={`/tasks/${task.id}`}
            key={task.id}
            className="block p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Due: {formatDate(task.due_date)}
                </p>
                {task.time_spent && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Time spent: {task.time_spent}
                  </p>
                )}
              </div>
              {task.formatted_status ? (
                <div className="priority-badge" aria-label={`Priority: ${task.priority}`} dangerouslySetInnerHTML={{ __html: task.formatted_status }} />
              ) : (
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full 
                  ${task.priority === 'High' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                    : task.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}
                  aria-label={`Priority: ${task.priority}`}
                >
                  {task.priority}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </DashboardWidget>
  );
}
