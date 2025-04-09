"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/Dashboard';
import Link from 'next/link';
import { FiPlus, FiFilter, FiSearch, FiCheckCircle, FiClock, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { Database } from '@/types/supabase';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';

// Define types from Supabase schema
type Task = Database['public']['Tables']['tasks']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

// Define status type to match the keys in statusStyles
type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
type TaskPriority = 'High' | 'Medium' | 'Low';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [requesters, setRequesters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Set up real-time subscription for tasks
  const { error: realtimeError } = useSupabaseRealtime({
    table: 'tasks',
    onChange: (payload) => {
      if (payload.eventType === 'INSERT') {
        setTasks(prev => [payload.new as Task, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setTasks(prev => 
          prev.map(task => 
            task.id === payload.new.id ? { ...task, ...payload.new } : task
          )
        );
      } else if (payload.eventType === 'DELETE') {
        setTasks(prev => 
          prev.filter(task => task.id !== payload.old.id)
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
  
  // Fetch tasks from Supabase
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .order('due_date', { ascending: true });

        if (tasksError) throw tasksError;
        
        // Debug log the first task to understand structure
        if (tasksData && tasksData.length > 0) {
          console.log('Sample task:', tasksData[0]);
        }
        
        // Set tasks data
        setTasks(tasksData || []);
        
        // Fetch project and requester information
        try {
          // Get unique project IDs from tasks
          const projectIds = [...new Set(tasksData?.map(task => task.project).filter(Boolean) || [])];
          
          // Get unique requester IDs from tasks
          const requesterIds = [...new Set(tasksData?.map(task => task.requester_id).filter(Boolean) || [])];
          
          // Fetch projects if we have any project IDs
          if (projectIds.length > 0) {
            const { data: projectsData, error: projectsError } = await supabase
              .from('projects')
              .select('*')
              .in('id', projectIds);
            
            if (projectsError) {
              console.error('Error fetching projects:', projectsError);
            } else if (projectsData && projectsData.length > 0) {
              // Log the first project to see its structure
              console.log('Sample project:', projectsData[0]);
              
              // Create projects lookup
              const projectsLookup: Record<string, any> = {};
              projectsData.forEach(project => {
                projectsLookup[project.id] = project;
              });
              setProjects(projectsLookup);
            }
          }
          
          // Fetch requesters if we have any requester IDs
          if (requesterIds.length > 0) {
            // Try to fetch from users table
            const { data: usersData, error: usersError } = await supabase
              .from('users')
              .select('*')
              .in('id', requesterIds);
            
            if (usersError) {
              console.error('Error fetching users:', usersError);
              
              // Try from contacts as fallback
              const { data: contactsData, error: contactsError } = await supabase
                .from('contacts')
                .select('*')
                .in('id', requesterIds);
                
              if (contactsError) {
                console.error('Error fetching contacts:', contactsError);
              } else if (contactsData && contactsData.length > 0) {
                // Log the first contact to see its structure
                console.log('Sample contact:', contactsData[0]);
                
                // Create requesters lookup from contacts
                const requestersLookup: Record<string, any> = {};
                contactsData.forEach(contact => {
                  requestersLookup[contact.id] = contact;
                });
                setRequesters(requestersLookup);
              }
            } else if (usersData && usersData.length > 0) {
              // Log the first user to see its structure
              console.log('Sample user:', usersData[0]);
              
              // Create requesters lookup from users
              const requestersLookup: Record<string, any> = {};
              usersData.forEach(user => {
                requestersLookup[user.id] = user;
              });
              setRequesters(requestersLookup);
            }
          }
        } catch (projectErr) {
          console.error("Error fetching project metadata:", projectErr);
        }
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
  }, []);

  // Filter tasks based on search term
  const filteredTasks = searchTerm
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : tasks;
    
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  // Status and priority styling
  const statusStyles: Record<TaskStatus, { badge: string, icon: JSX.Element }> = {
    'Pending': {
      badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      icon: <FiClock className="w-5 h-5" />
    },
    'In Progress': {
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      icon: <FiClock className="w-5 h-5" />
    },
    'Completed': {
      badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      icon: <FiCheckCircle className="w-5 h-5" />
    },
    'Blocked': {
      badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      icon: <FiAlertCircle className="w-5 h-5" />
    }
  };

  const priorityStyles: Record<TaskPriority, string> = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            View and manage your tasks
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FiFilter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <Link
            href="/tasks/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            New Task
          </Link>
        </div>
      </div>

      {/* Tasks list */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-12 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700">
          <div className="col-span-4 px-6 py-3">Task</div>
          <div className="col-span-2 px-6 py-3">Project</div>
          <div className="col-span-2 px-6 py-3">Requester</div>
          <div className="col-span-1 px-6 py-3">Status</div>
          <div className="col-span-2 px-6 py-3">Due Date</div>
          <div className="col-span-1 px-6 py-3">Priority</div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <FiLoader className="animate-spin h-8 w-8 mx-auto text-primary-600" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Error</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.map((task) => (
              <div key={task.id} className="grid grid-cols-12 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="col-span-4 px-6 py-4">
                  <div className="flex flex-col">
                    <Link 
                      href={`/tasks/${task.id}`}
                      className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 truncate"
                    >
                      {task.title}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {task.description || 'No description provided'}
                    </p>
                    {task.time_spent && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Time spent: {task.time_spent}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Project column */}
                <div className="col-span-2 px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {task.project ? (
                    projects[task.project] ? 
                      <span className="font-medium">
                        {projects[task.project].name || projects[task.project].title || 'Unknown Project'}
                      </span> : 
                      <span className="text-gray-500 dark:text-gray-400">Project ID: {task.project.slice(0, 8)}...</span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">No Project</span>
                  )}
                </div>
                
                {/* Requester column */}
                <div className="col-span-2 px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {task.requester_id ? (
                    requesters[task.requester_id] ? (
                      <span className="font-medium">
                        {requesters[task.requester_id].first_name && requesters[task.requester_id].last_name ? 
                          `${requesters[task.requester_id].first_name} ${requesters[task.requester_id].last_name}` : 
                          requesters[task.requester_id].email || requesters[task.requester_id].name || 'Unknown User'}
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">ID: {task.requester_id.slice(0, 8)}...</span>
                    )
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">No Requester</span>
                  )}
                </div>
                
                {/* Status column */}
                <div className="col-span-1 px-6 py-4">
                  {task.formatted_status ? (
                    <div dangerouslySetInnerHTML={{ __html: task.formatted_status }} />
                  ) : (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status as TaskStatus]?.badge || statusStyles['Pending'].badge}`}>
                      {statusStyles[task.status as TaskStatus]?.icon || statusStyles['Pending'].icon}
                      {task.status}
                    </span>
                  )}
                </div>
                
                {/* Due Date column */}
                <div className="col-span-2 px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(task.due_date)}
                </div>
                
                {/* Priority column */}
                <div className="col-span-1 px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority as TaskPriority] || priorityStyles['Medium']}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Get started by creating a new task.
            </p>
            <div className="mt-6">
              <Link
                href="/tasks/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                New Task
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
