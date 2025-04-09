"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase/client';
import DashboardWidget from './DashboardWidget';
import { FiCalendar } from 'react-icons/fi';

// Define meeting type from Supabase schema
import { Database } from '@/types/supabase';
type Meeting = Database['public']['Tables']['meetings']['Row'];

export default function MeetingsWidget() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch upcoming meetings
  const fetchMeetings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(2);
        
      if (error) {
        throw error;
      }
      
      setMeetings(data || []);
    } catch (err: any) {
      console.error('Error fetching meetings:', err);
      setError(err.message || 'Failed to fetch meetings');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);
  
  // Utility functions (memoized for performance)
  const formatters = useMemo(() => {
    return {
      // Format date for display
      formatDate: (dateString: string | null) => {
        if (!dateString) return 'Not scheduled';
        try {
          return format(new Date(dateString), 'MMM d, yyyy');
        } catch (e) {
          return 'Invalid date';
        }
      },
      
      // Format time for display
      formatTime: (dateString: string | null) => {
        if (!dateString) return '';
        try {
          return format(new Date(dateString), 'h:mm a');
        } catch (e) {
          return '';
        }
      },
      
      // Calculate meeting duration in minutes
      calculateDuration: (startTime: string | null, endTime: string | null) => {
        if (!startTime || !endTime) return '60 min';
        try {
          const start = new Date(startTime);
          const end = new Date(endTime);
          const durationMs = end.getTime() - start.getTime();
          return Math.round(durationMs / (1000 * 60)) + ' min'; 
        } catch (e) {
          return '60 min';
        }
      }
    };
  }, []);

  return (
    <DashboardWidget
      title="Upcoming Meetings"
      icon={<FiCalendar className="mr-2 text-primary-500" aria-hidden="true" />}
      viewAllLink="/meetings"
      isLoading={isLoading}
      error={error}
      isEmpty={meetings.length === 0}
      emptyMessage="No upcoming meetings scheduled"
      onRetry={fetchMeetings}
    >
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-white">
              {meeting.title}
            </h3>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex flex-wrap items-center">
                <span className="mr-3">{formatters.formatDate(meeting.start_time)}</span>
                <span>
                  {formatters.formatTime(meeting.start_time)} ({formatters.calculateDuration(meeting.start_time, meeting.end_time)})
                </span>
              </div>
            </div>
            {meeting.meeting_link && (
              <a
                href={meeting.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                aria-label={`Join meeting: ${meeting.title}`}
              >
                <FiCalendar className="mr-1" aria-hidden="true" /> Join Meeting
              </a>
            )}
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}
