"use client";

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase/client';
import DashboardWidget from './DashboardWidget';
import { FiFileText } from 'react-icons/fi';

// Define document type from Supabase schema
import { Database } from '@/types/supabase';
type Document = Database['public']['Tables']['documents']['Row'];

export default function DocumentsWidget() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch recent documents
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);
        
      if (error) {
        throw error;
      }
      
      setDocuments(data || []);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <DashboardWidget
      title="Recent Documents"
      icon={<FiFileText className="mr-2 text-primary-500" aria-hidden="true" />}
      viewAllLink="/documents"
      isLoading={isLoading}
      error={error}
      isEmpty={documents.length === 0}
      emptyMessage="No documents have been uploaded yet"
      onRetry={fetchDocuments}
    >
      <div className="space-y-3">
        {documents.map((document) => (
          <div key={document.id} className="p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div className="flex items-center">
              <div className="mr-3 text-gray-400">
                <FiFileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {document.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Uploaded: {formatDate(document.created_at)}
                </p>
                {document.file_path && (
                  <a 
                    href={document.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    aria-label={`View document: ${document.name}`}
                  >
                    View Document
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}
