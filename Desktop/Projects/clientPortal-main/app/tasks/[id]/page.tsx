"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/Dashboard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiArrowLeft, 
  FiClock, 
  FiCalendar, 
  FiTag, 
  FiFolder, 
  FiMessageSquare,
  FiPaperclip,
  FiSend,
  FiLoader,
  FiAlertCircle,
  FiSave,
  FiCheck
} from 'react-icons/fi';
import { Database } from '@/types/supabase';
import { supabase, getErrorMessage } from '@/lib/supabase/client';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { format } from 'date-fns';
import { debugDatabaseIssue } from '@/lib/utils/debug/schemaValidator';

// Define types from Supabase schema
type Task = Database['public']['Tables']['tasks']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];
type Attachment = Database['public']['Tables']['attachments']['Row'];

// Define status type to match the keys in statusStyles
type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
type TaskPriority = 'High' | 'Medium' | 'Low';

interface TaskDetailsProps {
  params: {
    id: string;
  };
}

export default function TaskDetails({ params }: TaskDetailsProps) {
  const router = useRouter();
  
  // State for task data
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [requester, setRequester] = useState<any>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Comment form state
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // Status update state
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<TaskStatus | ''>('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Set up real-time subscription for task updates
  useSupabaseRealtime({
    table: 'tasks',
    filter: 'id',
    filterValue: params.id,
    onChange: (payload) => {
      if (payload.eventType === 'UPDATE') {
        setTask(prev => ({ ...prev, ...payload.new } as Task));
      }
    }
  });
  
  // Set up real-time subscription for comments
  useSupabaseRealtime({
    table: 'comments',
    filter: 'task_id',
    filterValue: params.id,
    onChange: (payload) => {
      if (payload.eventType === 'INSERT') {
        setComments(prev => [...prev, payload.new as Comment]);
      } else if (payload.eventType === 'UPDATE') {
        setComments(prev => 
          prev.map(comment => 
            comment.id === payload.new.id ? { ...comment, ...payload.new } : comment
          )
        );
      } else if (payload.eventType === 'DELETE') {
        setComments(prev => 
          prev.filter(comment => comment.id !== payload.old.id)
        );
      }
    }
  });
  
  // Set up real-time subscription for attachments
  useSupabaseRealtime({
    table: 'attachments',
    filter: 'task_id',
    filterValue: params.id,
    onChange: (payload) => {
      if (payload.eventType === 'INSERT') {
        setAttachments(prev => [...prev, payload.new as Attachment]);
      } else if (payload.eventType === 'DELETE') {
        setAttachments(prev => 
          prev.filter(attachment => attachment.id !== payload.old.id)
        );
      }
    }
  });

  // Fetch task data
  useEffect(() => {
    async function fetchTaskData() {
      try {
        setLoading(true);
        
        console.log('Fetching task with ID:', params.id);
        
        // Fetch task
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (taskError) throw taskError;
        if (!taskData) throw new Error('Task not found');
        
        console.log('Task data retrieved:', taskData);
        setTask(taskData);
        
        // Fetch related data
        await Promise.all([
          fetchProject(taskData.project),
          fetchRequester(taskData.requester_id),
          fetchComments(),
          fetchAttachments()
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError(getErrorMessage(err));
        setLoading(false);
      }
    }
    
    async function fetchProject(projectId: string | null) {
      if (!projectId) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
      }
    }
    
    async function fetchRequester(requesterId: string | null) {
      if (!requesterId) return;
      
      try {
        // Try to fetch from contacts first
        const { data: contactData, error: contactError } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', requesterId)
          .single();
        
        if (!contactError && contactData) {
          setRequester(contactData);
          return;
        }
        
        // If not found, try to fetch from users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', requesterId)
          .single();
        
        if (!userError && userData) {
          setRequester(userData);
        }
      } catch (err) {
        console.error('Error fetching requester:', err);
      }
    }
    
    async function fetchComments() {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('task_id', params.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        setComments(data || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }
    
    async function fetchAttachments() {
      try {
        const { data, error } = await supabase
          .from('attachments')
          .select('*')
          .eq('task_id', params.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setAttachments(data || []);
      } catch (err) {
        console.error('Error fetching attachments:', err);
      }
    }
    
    fetchTaskData();
  }, [params.id]);
  
  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !task) return;
    
    setSubmittingComment(true);
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          task_id: task.id,
          content: commentText.trim(),
          created_at: new Date().toISOString(),
          // In a real app, you would use the current user's ID for author_id
          author_id: 'current-user-id', 
          author_name: 'You',
          author_role: 'Client'
        })
        .select();
      
      if (error) throw error;
      
      // Clear comment input
      setCommentText('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };
  
  // Handle status update
  const updateTaskStatus = async () => {
    if (!newStatus || !task) return;
    
    setUpdatingStatus(true);
    
    try {
      console.log('Updating task status:', {
        taskId: task.id,
        newStatus,
        currentStatus: task.status
      });
      
      // Create update object with only the necessary fields
      const updateData: {
        status: string;
        updated_at: string;
      } = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      // Run diagnostic on the tasks table before update
      await debugDatabaseIssue({
        tableName: 'tasks',
        operation: 'update',
        data: updateData,
        id: task.id
      });
      
      // Attempt the update operation
      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', task.id);
      
      if (error) {
        console.error('Supabase error details:', error);
        
        // Create a more user-friendly error message based on the error code
        let errorMessage = 'Failed to update task status. Please try again.';
        
        if (error.code === '23502') {
          errorMessage = 'A required field is missing in the database. Please contact support.';
        } else if (error.code === '42P01') {
          errorMessage = 'The tasks table cannot be found. Please contact support.';
        }
        
        alert(errorMessage);
        throw error;
      }
      
      // Update local state
      setTask(prev => prev ? { ...prev, status: newStatus } : null);
      setStatusUpdateOpen(false);
    } catch (err) {
      console.error('Error updating task status:', err);
      // Error alert is already shown above if it's a Supabase error
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Formatting functions
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMMM d, yyyy \'at\' h:mm a');
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Status and priority styling
  const statusStyles: Record<TaskStatus, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Blocked': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  const priorityStyles: Record<TaskPriority, string> = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <FiLoader className="animate-spin h-10 w-10 text-primary-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading task details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !task) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <FiAlertCircle className="h-10 w-10 text-red-600 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Error Loading Task</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Task not found'}</p>
          <Link
            href="/tasks"
            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back button and task title */}
      <div className="mb-6">
        <Link
          href="/tasks"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
      </div>

      {/* Task details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Task details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task description card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {task.description || 'No description provided for this task.'}
            </p>
          </div>

          {/* Attachments card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Attachments
            </h2>
            {attachments.length > 0 ? (
              <div className="space-y-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-start p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <div className="text-gray-400 mr-3">
                      <FiPaperclip className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {attachment.filename}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {attachment.file_size && formatFileSize(attachment.file_size)} • {formatDate(attachment.created_at)}
                      </p>
                    </div>
                    <a 
                      href={attachment.file_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No attachments for this task.</p>
            )}
            <div className="mt-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <FiPaperclip className="mr-2 h-4 w-4" />
                Add Attachment
              </button>
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Comments
            </h2>
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex ${comment.author_name === 'You' ? 'justify-end' : ''}`}
                  >
                    <div className={`max-w-lg ${comment.author_name === 'You' ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/30' : 'bg-gray-50 dark:bg-gray-750 border-gray-100 dark:border-gray-700'} rounded-lg p-4 border`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{comment.author_name}</span>
                          {comment.author_role && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{comment.author_role}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(comment.created_at)}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment on this task.</p>
              )}
            </div>
            <div className="mt-6">
              <form onSubmit={handleSubmitComment}>
                <div className="relative">
                  <textarea
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Type your comment here..."
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={submittingComment}
                  ></textarea>
                  <button 
                    type="submit"
                    className="absolute right-3 bottom-3 inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!commentText.trim() || submittingComment}
                  >
                    <FiSend className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right column - Task metadata */}
        <div className="space-y-6">
          {/* Task status card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Task Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status as TaskStatus] || statusStyles['Pending']}`}>
                  {task.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</h3>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority as TaskPriority] || priorityStyles['Medium']}`}>
                  {task.priority}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Due Date</h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                  {formatDate(task.due_date)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Project</h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiFolder className="mr-2 h-4 w-4 text-gray-400" />
                  {task.project && project ? (
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {project.name}
                    </Link>
                  ) : (
                    <span>Not assigned to a project</span>
                  )}
                </div>
              </div>
              {requester && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Requester</h3>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    {requester.first_name && requester.last_name ? 
                      `${requester.first_name} ${requester.last_name}` : 
                      requester.email || requester.name || 'Unknown'}
                  </div>
                </div>
              )}
              {task.assignee && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Assigned To</h3>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    {task.assignee}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                  {formatDate(task.created_at)}
                </div>
              </div>
              {task.updated_at && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h3>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                    {formatDate(task.updated_at)}
                  </div>
                </div>
              )}
              {task.time_spent && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Time Spent</h3>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                    {task.time_spent}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Actions
            </h2>
            <div className="space-y-3">
              <button 
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setStatusUpdateOpen(true)}
              >
                Update Status
              </button>
              <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Request Update
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Update Dialog */}
      {statusUpdateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setStatusUpdateOpen(false)}></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Update Task Status
                    </h3>
                    <div className="mt-4">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Status
                      </label>
                      <select
                        id="status"
                        className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900 dark:text-white"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                      >
                        <option value="">Select a status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={updateTaskStatus}
                  disabled={!newStatus || updatingStatus}
                >
                  {updatingStatus ? (
                    <>
                      <FiLoader className="animate-spin h-4 w-4 mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setStatusUpdateOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
