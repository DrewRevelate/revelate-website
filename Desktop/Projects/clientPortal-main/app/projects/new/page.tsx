"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/Dashboard';
import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiUser, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '@/lib/supabase/client';
import { getErrorMessage } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

// Define types from Supabase schema
type Client = Database['public']['Tables']['accounts']['Row'];

export default function NewProject() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>('Planning');
  const [startDate, setStartDate] = useState<string>('');
  const [targetEndDate, setTargetEndDate] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  
  // Data loading state
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Fetch clients for dropdown
  useEffect(() => {
    async function fetchClients() {
      try {
        setLoadingClients(true);
        const { data, error } = await supabase
          .from('accounts')
          .select('id, name')
          .order('name', { ascending: true });
        
        if (error) throw error;
        setClients(data || []);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setFormError(getErrorMessage(err));
      } finally {
        setLoadingClients(false);
      }
    }
    
    fetchClients();
  }, []);
  
  // Form validation
  const validateForm = () => {
    if (!name.trim()) {
      setFormError('Project name is required');
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
      // Set default values for new project
      const today = new Date().toISOString().split('T')[0];
      const newProject = {
        name,
        description: description || null,
        status,
        start_date: startDate || today,
        target_end_date: targetEndDate || null,
        client_id: clientId || null,
        completion_percentage: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Insert new project into Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select();
      
      if (error) throw error;
      
      // Redirect to project detail page on success
      if (data && data.length > 0) {
        router.push(`/projects/${data[0].id}`);
      } else {
        // If no data returned, redirect to projects list
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setFormError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      {/* Back button and page title */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
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
          
          {/* Project Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          {/* Project Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          {/* Project Status */}
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          {/* Two-column layout for dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiCalendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            
            {/* Target End Date */}
            <div>
              <label htmlFor="targetEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiCalendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  id="targetEndDate"
                  className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                  value={targetEndDate}
                  onChange={(e) => setTargetEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Client */}
          <div className="mb-6">
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiUser className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <select
                id="client"
                className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={loadingClients}
              >
                <option value="">Select Client (Optional)</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8">
            <Link
              href="/projects"
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
