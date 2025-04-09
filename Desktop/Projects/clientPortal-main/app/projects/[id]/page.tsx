"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/Dashboard';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiCheckSquare,
  FiFileText,
  FiMessageSquare,
  FiPlus,
  FiLoader,
  FiAlertCircle,
  FiSend
} from 'react-icons/fi';
import { supabase } from '@/lib/supabase/client';
import { getErrorMessage } from '@/lib/supabase/client';
import { format, formatDistance } from 'date-fns';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { Database } from '@/types/supabase';

interface ProjectDetailsProps {
  params: {
    id: string;
  };
}

// Define types from Supabase schema
type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type Document = Database['public']['Tables']['documents']['Row'];
type Update = Database['public']['Tables']['project_updates']['Row'] & {
  user?: {
    first_name: string | null;
    last_name: string | null;
    role: string | null;
  };
};

interface Milestone {
  id: string;
  name: string;
  status: string;
  date: string | null;
  project_id: string;
}

export default function ProjectDetails({ params }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New update form state
  const [updateText, setUpdateText] = useState('');
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  // Set up real-time subscription for project updates
  useSupabaseRealtime({
    table: 'projects',
    filter: 'id',
    filterValue: params.id,
    onChange: (payload) => {
      if (payload.eventType === 'UPDATE') {
        setProject(prev => ({ ...prev, ...payload.new } as Project));
      }
    }
  });
  
  // Set up real-time subscription for tasks
  useSupabaseRealtime({
    table: 'tasks',
    filter: 'project',
    filterValue: params.id,
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
  
  // Set up real-time subscription for documents
  useSupabaseRealtime({
    table: 'documents',
    filter: 'project_id',
    filterValue: params.id,
    onChange: (payload) => {
      if (payload.eventType === 'INSERT') {
        setDocuments(prev => [payload.new as Document, ...prev]);
      } else if (payload.eventType === 'DELETE') {
        setDocuments(prev => 
          prev.filter(doc => doc.id !== payload.old.id)
        );
      }
    }
  });
  
  // Set up real-time subscription for project updates
  useSupabaseRealtime({
    table: 'project_updates',
    filter: 'project_id',
    filterValue: params.id,
    onChange: (payload) => {
      if (payload.eventType === 'INSERT') {
        // For newly inserted updates, we need to fetch the associated user data
        fetchUpdateWithUser(payload.new.id);
      }
    }
  });

  // Fetch project and related data
  useEffect(() => {
    async function fetchProjectData() {
      try {
        setIsLoading(true);
        
        // Fetch the project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (projectError) throw projectError;
        if (!projectData) throw new Error('Project not found');
        
        setProject(projectData);
        
        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('project', params.id)
          .order('created_at', { ascending: false });
        
        if (tasksError) throw tasksError;
        setTasks(tasksData || []);
        
        // Fetch documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .eq('project_id', params.id)
          .order('created_at', { ascending: false });
        
        if (documentsError) throw documentsError;
        setDocuments(documentsData || []);
        
        // Fetch project updates with user info
        const { data: updatesData, error: updatesError } = await supabase
          .from('project_updates')
          .select(`
            *,
            user:user_id (
              first_name,
              last_name,
              role
            )
          `)
          .eq('project_id', params.id)
          .order('created_at', { ascending: false });
        
        if (updatesError) throw updatesError;
        setUpdates(updatesData || []);
        
        // For the sample implementation, we'll create milestones based on project dates
        // In a real implementation, you might fetch these from a dedicated table
        const projectMilestones = [
          { 
            id: '1', 
            name: 'Project Kickoff', 
            status: 'Completed', 
            date: projectData.start_date || projectData.created_at,
            project_id: params.id
          },
          { 
            id: '2', 
            name: 'Project Completion', 
            status: projectData.actual_end_date ? 'Completed' : 'Not Started', 
            date: projectData.actual_end_date || projectData.target_end_date || null,
            project_id: params.id
          }
        ];
        setMilestones(projectMilestones);
        
        // In a real implementation, you might fetch team members from a junction table
        // For now, we'll just set some sample team members
        setTeam(['Project Manager', 'Developer', 'Designer']);
      } catch (err: any) {
        console.error('Error fetching project data:', err);
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjectData();
  }, [params.id]);

  // Helper function to fetch a single update with its user data
  async function fetchUpdateWithUser(updateId: string) {
    try {
      const { data, error } = await supabase
        .from('project_updates')
        .select(`
          *,
          user:user_id (
            first_name,
            last_name,
            role
          )
        `)
        .eq('id', updateId)
        .single();
      
      if (error) throw error;
      if (data) {
        setUpdates(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error('Error fetching update with user:', err);
    }
  }
  
  // Handle submitting a new project update
  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateText.trim() || !project) return;
    
    setSubmittingUpdate(true);
    
    try {
      // Create update data without requiring user relationship
      const updateData = {
        project_id: project.id,
        content: updateText.trim(),
        created_at: new Date().toISOString(),
        // Only include this if the field exists and is required
        user_id: null, // Set to null or remove if not required
        author_name: 'Client User', // Add this field if it exists to identify the author
      };
      
      const { data, error } = await supabase
        .from('project_updates')
        .insert(updateData)
        .select();
      
      if (error) throw error;
      
      // If successfully inserted, add to local state
      if (data && data.length > 0) {
        // Add the new update to the updates array
        setUpdates(prevUpdates => [{
          ...data[0],
          user: {
            first_name: 'Client',
            last_name: 'User',
            role: 'Client'
          }
        }, ...prevUpdates]);
      }
      
      // Clear update input
      setUpdateText('');
    } catch (err) {
      console.error('Error submitting update:', err);
      alert('Failed to submit update. Please try again.');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (e) {
      return '';
    }
  };
  
  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };
  
  // Convert bytes to readable file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Status colors
  const statusColors: Record<string, string> = {
    'Planning': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'On Hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Not Started': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  // Task priority colors
  const priorityColors: Record<string, string> = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <FiLoader className="animate-spin h-8 w-8 text-primary-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading project details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error || 'Project not found'}</p>
          <Link
            href="/projects"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back button and project title */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            <div className="mt-1 flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status] || statusColors['In Progress']}`}>
                {project.status}
              </span>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {project.completion_percentage}% Complete
              </span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <div className="w-full sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: `${project.completion_percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Project details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Project details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {project.description || 'No description provided.'}
            </p>
          </div>

          {/* Milestones card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
              Milestones
            </h2>
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative ml-6">
                    {/* Milestone dot */}
                    <div className={`absolute -left-9 top-0.5 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${
                      milestone.status === 'Completed' 
                        ? 'bg-green-500' 
                        : milestone.status === 'In Progress'
                        ? 'bg-blue-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}></div>
                    
                    {/* Milestone content */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">
                        {milestone.name}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[milestone.status]}`}>
                          {milestone.status}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          <FiCalendar className="inline mr-1 h-3 w-3" />
                          {formatDate(milestone.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tasks
              </h2>
              <Link href={`/tasks/new?project=${project.id}`} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/40">
                <FiPlus className="mr-1.5 h-3.5 w-3.5" />
                Add Task
              </Link>
            </div>
            
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Due: {task.due_date ? formatDate(task.due_date) : 'Not set'}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className={`mr-2 px-2.5 py-0.5 text-xs font-medium rounded-full ${priorityColors[task.priority as string] || priorityColors['Medium']}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          task.status === 'Completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : task.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No tasks yet</p>
            )}
            
            {tasks.length > 0 && (
              <div className="mt-4 text-center">
                <Link
                  href={`/tasks?project=${project.id}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  View All Tasks
                </Link>
              </div>
            )}
          </div>

          {/* Documents card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Documents
              </h2>
              <Link href={`/documents/upload?project_id=${project.id}`} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/40">
                <FiPlus className="mr-1.5 h-3.5 w-3.5" />
                Upload
              </Link>
            </div>
            
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-gray-400">
                        <FiFileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {document.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {document.file_size && formatFileSize(document.file_size)} • Uploaded {formatDate(document.created_at)}
                        </p>
                      </div>
                    </div>
                    <Link href={document.file_path || '#'} className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                      Download
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No documents yet</p>
            )}
            
            {documents.length > 0 && (
              <div className="mt-4 text-center">
                <Link
                  href={`/documents?project_id=${project.id}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  View All Documents
                </Link>
              </div>
            )}
          </div>

          {/* Updates card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Project Updates
            </h2>
            
            {/* Add Update form */}
            <div className="mb-6">
              <form onSubmit={handleSubmitUpdate}>
                <div className="relative">
                  <textarea
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Share an update about this project..."
                    rows={3}
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    disabled={submittingUpdate}
                  ></textarea>
                  <button 
                    type="submit"
                    className="absolute right-3 bottom-3 inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!updateText.trim() || submittingUpdate}
                  >
                    <FiSend className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
            
            {updates.length > 0 ? (
              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update.id} className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-2">
                        <FiMessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {update.user 
                              ? `${update.user.first_name || ''} ${update.user.last_name || ''}`.trim() || 'Team Member'
                              : 'Team Member'
                            }
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {update.user?.role || 'Team Member'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(update.created_at)} at {formatTime(update.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="pl-10">
                      <p className="text-gray-700 dark:text-gray-300">
                        {update.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No updates yet</p>
            )}
          </div>
        </div>

        {/* Right column - Project metadata */}
        <div className="space-y-6">
          {/* Project details card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Project Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status] || statusColors['In Progress']}`}>
                  {project.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                  {formatDate(project.start_date)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Target End Date</h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                  {formatDate(project.target_end_date)}
                </div>
              </div>
              {project.actual_end_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Actual End Date</h3>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                    {formatDate(project.actual_end_date)}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Project Team</h3>
                <div className="flex flex-col text-gray-700 dark:text-gray-300">
                  <div className="flex items-center mb-2">
                    <FiUsers className="mr-2 h-4 w-4 text-gray-400" />
                    {team.length} Members
                  </div>
                  <div className="space-y-2 pl-6">
                    {team.map((member, index) => (
                      <div key={index} className="text-sm">
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                  {formatDate(project.created_at)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                  {formatRelativeTime(project.updated_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Actions
            </h2>
            <div className="space-y-3">
              <Link 
                href={`/tasks/new?project=${project.id}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiCheckSquare className="mr-2 h-4 w-4" />
                Create New Task
              </Link>
              <button 
                onClick={() => document.querySelector('textarea')?.focus()}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <FiMessageSquare className="mr-2 h-4 w-4" />
                Add Update
              </button>
              <Link
                href={`/meetings/new?project_id=${project.id}`}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <FiCalendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
