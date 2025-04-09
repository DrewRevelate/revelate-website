// Project related types
export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled' | 'Not Started';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  target_end_date: string | null;
  actual_end_date: string | null;
  completion_percentage: number;
  client_id: string;
  created_at: string;
  updated_at: string;
}

// Task related types
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  project_id: string | null;
  assigned_by: string | null;
  assigned_to: string | null;
  client_id: string;
  created_at: string;
  updated_at: string;
}

// Meeting related types
export type MeetingStatus = 'Upcoming' | 'Live' | 'Completed' | 'Cancelled';

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: MeetingStatus;
  meeting_link: string | null;
  meeting_id: string | null;
  passcode: string | null;
  dial_in: string | null;
  recording_link: string | null;
  transcript_link: string | null;
  project_id: string | null;
  client_id: string;
  organizer_id: string;
  created_at: string;
  updated_at: string;
}

// Document related types
export type DocumentStatus = 'Current' | 'Archived' | 'Pending' | 'Expired';
export type SignatureStatus = 'Not Required' | 'Pending' | 'Signed' | 'Rejected';

export interface Document {
  id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_type: string;
  file_size: number;
  category: string | null;
  status: DocumentStatus;
  requires_signature: boolean;
  signature_status: SignatureStatus | null;
  project_id: string | null;
  client_id: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

// Time package related types
export type TimePackageStatus = 'Active' | 'Completed' | 'Expired' | 'Upcoming';

export interface TimePackage {
  id: string;
  name: string;
  hours: number;
  hours_used: number;
  purchase_date: string;
  expiration_date: string | null;
  status: TimePackageStatus;
  client_id: string;
  created_at: string;
  updated_at: string;
}

// User/Profile related types
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
