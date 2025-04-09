"use client";

import DashboardLayout from '@/components/layout/Dashboard';
import Link from 'next/link';
import { FiFilter, FiSearch, FiUpload, FiDownload, FiEye, FiFolder, FiFile, FiFileText, FiFilePlus, FiGrid, FiList } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import ImageCard, { DefaultImageActions } from '@/components/ui/ImageCard';
import { generateResponsiveSizes } from '@/lib/utils';

export default function Documents() {
  // Define types from Supabase schema
  type Document = Database['public']['Tables']['documents']['Row'];
  type Project = Database['public']['Tables']['projects']['Row'];
  
  // State for documents and UI
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Document counts by category
  const [documentCounts, setDocumentCounts] = useState({
    all: 0,
    agreements: 0,
    invoices: 0,
    projectFiles: 0
  });
  
  // Fetch documents from Supabase
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        
        // Fetch documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (documentsError) throw documentsError;
        
        // Fetch projects to get project names
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, name');
          
        if (projectsError) throw projectsError;
        
        // Create a lookup object for projects
        const projectsLookup: Record<string, Project> = {};
        projectsData?.forEach(project => {
          projectsLookup[project.id] = project;
        });
        
        // Calculate document counts by category
        const counts = {
          all: documentsData?.length || 0,
          agreements: documentsData?.filter(doc => doc.category === 'Agreement').length || 0,
          invoices: documentsData?.filter(doc => doc.category === 'Invoice').length || 0,
          projectFiles: documentsData?.filter(doc => doc.project_id !== null).length || 0
        };
        
        setDocuments(documentsData || []);
        setProjects(projectsLookup);
        setDocumentCounts(counts);
      } catch (err: any) {
        console.error('Error fetching documents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDocuments();
  }, []);
  
  // Filter documents based on search term
  const filteredDocuments = searchTerm
    ? documents.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : documents;

  // Document type icons and colors
  type DocumentType = 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'Folder';

  const documentTypeIcons: Record<DocumentType, JSX.Element> = {
    'PDF': <FiFileText className="h-6 w-6" />,
    'DOCX': <FiFile className="h-6 w-6" />,
    'XLSX': <FiFile className="h-6 w-6" />,
    'PPTX': <FiFile className="h-6 w-6" />,
    'Folder': <FiFolder className="h-6 w-6" />
  };

  const documentTypeColors: Record<DocumentType, string> = {
    'PDF': 'text-red-500 dark:text-red-400',
    'DOCX': 'text-blue-500 dark:text-blue-400',
    'XLSX': 'text-green-500 dark:text-green-400',
    'PPTX': 'text-orange-500 dark:text-orange-400',
    'Folder': 'text-yellow-500 dark:text-yellow-400'
  };

  // Status colors
  type DocumentStatus = 'Current' | 'Archived' | 'Pending' | 'Expired' | 'Paid';

  const statusColors: Record<DocumentStatus, string> = {
    'Current': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Expired': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Paid': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  };

  // Function to get document thumbnail based on type
  const getDocumentThumbnail = (type: DocumentType) => {
    switch (type) {
      case 'PDF':
        return '/thumbnails/pdf.svg';
      case 'DOCX':
        return '/thumbnails/doc.svg';
      case 'XLSX':
        return '/thumbnails/xls.svg';
      case 'PPTX':
        return '/thumbnails/ppt.svg';
      case 'Folder':
        return '/thumbnails/folder.svg';
      default:
        return '/thumbnails/file.svg';
    }
  };

  // Get document file type from file path
  const getDocumentType = (file_type: string): DocumentType => {
    const type = file_type.toUpperCase();
    if (type === 'PDF') return 'PDF';
    if (type === 'DOCX' || type === 'DOC') return 'DOCX';
    if (type === 'XLSX' || type === 'XLS') return 'XLSX';
    if (type === 'PPTX' || type === 'PPT') return 'PPTX';
    return 'PDF'; // Default
  };
  
  // Format file size for display
  const formatFileSize = (size: number | null): string => {
    if (!size) return 'Unknown';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Function to render grid view using the optimized ImageCard component
  const renderGridView = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading documents...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">Error loading documents</div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      );
    }
    
    if (filteredDocuments.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No documents found</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => {
          const docType = getDocumentType(document.file_type);
          return (
            <ImageCard
              key={document.id}
              src={getDocumentThumbnail(docType)}
              alt={`${document.name} ${document.file_type} file`}
              title={document.name}
              description={`${document.file_type} • ${formatFileSize(document.file_size)} • ${document.category || 'Document'}`}
              aspectRatio="square"
              icon={
                <div className={`p-4 rounded-full bg-gray-100 dark:bg-gray-800 ${documentTypeColors[docType]}`}>
                  {documentTypeIcons[docType]}
                </div>
              }
              actions={
                <>
                  {document.file_path && (
                    <DefaultImageActions.Download onClick={() => window.open(document.file_path, '_blank')} />
                  )}
                  {document.file_path && (
                    <DefaultImageActions.Preview onClick={() => window.open(document.file_path, '_blank')} />
                  )}
                </>
              }
              onClick={() => document.file_path && window.open(document.file_path, '_blank')}
              className="h-full"
            />
          );
        })}
      </div>
    );
  };

  // Function to render list view
  const renderListView = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading documents...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">Error loading documents</div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      );
    }
    
    if (filteredDocuments.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No documents found</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uploaded
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocuments.map((document) => {
                const docType = getDocumentType(document.file_type);
                return (
                  <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 mr-3 ${documentTypeColors[docType]}`}>
                          {documentTypeIcons[docType]}
                        </div>
                        <div>
                          <a
                            href={document.file_path || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {document.name}
                          </a>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {document.file_type} • {formatFileSize(document.file_size)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {document.category || 'Document'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {document.project_id ? projects[document.project_id]?.name || 'Unknown Project' : 'No Project'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(document.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[document.status as DocumentStatus] || statusColors['Current']
                      }`}>
                        {document.status || 'Current'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {document.file_path && (
                        <a 
                          href={document.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <FiDownload className="h-4 w-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Access and manage your documents and agreements
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
              placeholder="Search documents..."
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
          <button
            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiUpload className="w-4 h-4 mr-2" />
            Upload
          </button>
        </div>
      </div>

      {/* Document categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 text-center">
          <div className="text-primary-600 dark:text-primary-400 mb-2">
            <FiFilePlus className="h-6 w-6 mx-auto" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">All Documents</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{documentCounts.all} files</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 text-center">
          <div className="text-blue-600 dark:text-blue-400 mb-2">
            <FiFileText className="h-6 w-6 mx-auto" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Agreements</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{documentCounts.agreements} file{documentCounts.agreements !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 text-center">
          <div className="text-green-600 dark:text-green-400 mb-2">
            <FiFileText className="h-6 w-6 mx-auto" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Invoices</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{documentCounts.invoices} file{documentCounts.invoices !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 text-center">
          <div className="text-yellow-600 dark:text-yellow-400 mb-2">
            <FiFolder className="h-6 w-6 mx-auto" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Project Files</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{documentCounts.projectFiles} file{documentCounts.projectFiles !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* View toggle and document list */}
      <div className="space-y-6">
        <div className="flex justify-end">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center px-3 py-1.5 border ${viewMode === 'grid' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
              } rounded-l-md text-sm font-medium focus:outline-none`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center px-3 py-1.5 border ${viewMode === 'list' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
              } rounded-r-md text-sm font-medium focus:outline-none`}
            >
              <FiList className="h-4 w-4" />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? renderGridView() : renderListView()}
      </div>
    </DashboardLayout>
  );
}
