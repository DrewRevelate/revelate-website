// Constants for the application

// Supabase
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// App info
export const APP_NAME = 'RevelateOps Client Portal';
export const APP_DESCRIPTION = 'Secure client portal for RevelateOps customers.';

// Theme
export const THEME_STORAGE_KEY = 'revelate-theme';

// Statuses
export const PROJECT_STATUSES = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed', 'Blocked'];
export const MEETING_STATUSES = ['Upcoming', 'Live', 'Completed', 'Cancelled'];
export const DOCUMENT_STATUSES = ['Current', 'Archived', 'Pending', 'Expired'];

// Priorities
export const TASK_PRIORITIES = ['High', 'Medium', 'Low'];

// Date formats
export const DATE_FORMAT = 'MMMM D, YYYY';
export const TIME_FORMAT = 'h:mm A';
