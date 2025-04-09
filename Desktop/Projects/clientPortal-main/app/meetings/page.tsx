'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase/client';
import CalendlyEmbed from '@/components/calendly/CalendlyEmbed';
import CalendlyFallback from '@/components/calendly/CalendlyFallback';

export default function MeetingsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [calendlyError, setCalendlyError] = useState(false);
  
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          // Get more user details from the profiles table if needed
          const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          setCurrentUser({
            ...data.user,
            ...profileData
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
    
    loadUserProfile();
    
    // Add a timeout to check if Calendly loaded correctly
    const timer = setTimeout(() => {
      // Check if any Calendly elements exist and are visible
      const calendlyElements = document.querySelectorAll('.calendly-inline-widget iframe');
      if (calendlyElements.length === 0) {
        setCalendlyError(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Schedule a Meeting</h1>
      
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Book Time with RevelateOps</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Select a time that works for you to discuss your project, get support, or plan next steps.
          </p>
        </div>
        
        {calendlyError ? (
          <CalendlyFallback username="drewlambert" />
        ) : (
          <CalendlyEmbed 
            email={currentUser?.email || ''}
            firstName={currentUser?.first_name || ''}
            lastName={currentUser?.last_name || ''}
            height={700}
          />
        )}
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
        <UpcomingMeetings />
      </div>
    </div>
  );
}

function UpcomingMeetings() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadMeetings() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('meetings')
          .select(`
            *,
            contacts (
              first_name,
              last_name,
              email
            )
          `)
          .eq('status', 'scheduled')
          .gte('meeting_date', new Date().toISOString())
          .order('meeting_date', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setMeetings(data || []);
      } catch (error) {
        console.error('Error loading meetings:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadMeetings();
  }, []);
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }
  
  if (meetings.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No upcoming meetings scheduled.</p>
      </Card>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };
  
  return (
    <div className="grid gap-4">
      {meetings.map((meeting) => (
        <Card key={meeting.id} className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">{meeting.title}</h3>
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                {formatDate(meeting.meeting_date)}
              </p>
              
              {meeting.contacts && (
                <p className="text-sm mb-2">
                  With: {meeting.contacts.first_name} {meeting.contacts.last_name}
                </p>
              )}
              
              {meeting.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">{meeting.description}</p>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col space-y-2">
              {meeting.meeting_link && (
                <a 
                  href={meeting.meeting_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Join Meeting
                </a>
              )}
              
              {meeting.reschedule_url && (
                <a 
                  href={meeting.reschedule_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Reschedule
                </a>
              )}
              
              {meeting.cancel_url && (
                <a 
                  href={meeting.cancel_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Cancel
                </a>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
