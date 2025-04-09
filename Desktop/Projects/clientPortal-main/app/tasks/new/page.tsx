"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/Dashboard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCalendar, FiFolder, FiUser, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '@/lib/supabase/client';
import { getErrorMessage } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

// Define types from Supabase schema
type Project = Database['public']['Tables']['projects']['Row'];
type Contact = Database['public']['Tables']['contacts']['Row'];

export default function NewTask() {
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>('Pending');
  const [priority, setPriority] = useState<string>('Medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [requesterId, setRequesterId] = useState<string>('');
  
  // Data loading state
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Fetch projects and contacts
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch projects
        setLoadingProjects(true);
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, name')
          .order('name', { ascending: true });
        
        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
        setLoadingProjects(false);
        
        // Fetch contacts (for requester selection)
        setLoadingContacts(true);
        const { data: contactsData, error: contactsError } = await supabase
          .from('contacts')
          .select('id, first_name, last_name, email')
          .order('last_name', { ascending: true });
        
        if (contactsError) throw contactsError;
        setContacts(contactsData || []);
        setLoadingContacts(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setFormError(getErrorMessage(error));
        setLoadingProjects(false);
        setLoadingContacts(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      setFormError('Task title is required');
      return false;
    }
    
    setFormError(null);
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Insert new task into Supabase
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          description: description || null,
          status,
          priority,
          due_date: dueDate || null,
          project: selectedProject || null,
          requester_id: requesterId || null,
          created_at: new Date().toISOString(),
        })
        .select();
      
      if (error) throw error;
      
      // Redirect to task list on success
      router.push('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      setFormError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      {/* Back button and page title */}
      <div className="mb-6">
        <Link
          href="/tasks"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
      </div>
      
      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit}>
          {/* Display form error if any */}
          {formError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400">
              <div className="flex items-center">
                <FiAlertCircle className="h-5 w-5 mr-2" />
                <span>{formError}</span>
              </div>
            </div>
          )}
          
          {/* Task Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          {/* Task Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          {/* Two-column layout for status and priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                id="priority"
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          {/* Due Date */}
          <div className="mb-6">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiCalendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="date"
                id="dueDate"
                className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          
          {/* Project */}
          <div className="mb-6">
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiFolder className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <select
                id="project"
                className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                disabled={loadingProjects}
              >
                <option value="">Select Project (Optional)</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Requester */}
          <div className="mb-6">
            <label htmlFor="requester" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Requester
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiUser className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <select
                id="requester"
                className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                value={requesterId}
                onChange={(e) => setRequesterId(e.target.value)}
                disabled={loadingContacts}
              >
                <option value="">Select Requester (Optional)</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name} {contact.email ? `(${contact.email})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8">
            <Link
              href="/tasks"
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
