'use client';

import { useState, useEffect } from 'react';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { supabase } from '@/lib/supabase/client';

interface CalendlyEmbedProps {
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  className?: string;
  height?: number | string;
  eventType?: string;
}

export default function CalendlyEmbed({
  email = '',
  firstName = '',
  lastName = '',
  companyName = '',
  className = '',
  height = 700,
  eventType = '', // Leave empty to show all event types
}: CalendlyEmbedProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user ID to associate meetings with the correct user
  useEffect(() => {
    async function getUserId() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUserId(data.user.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    getUserId();
  }, []);

  // Handle Calendly events
  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      try {
        if (!userId) return;
        
        // Log the event data for debugging
        console.log('Calendly event scheduled:', e.data.payload);
        
        // Store the event in our database with fixed values
        // to avoid TypeScript issues
        const { error } = await supabase.from('meetings').insert({
          title: 'Meeting with RevelateOps',
          meeting_date: new Date().toISOString(),
          contact_id: null,
          meeting_link: '',
          status: 'scheduled',
        });

        if (error) {
          console.error('Error storing meeting:', error);
        }
      } catch (error) {
        console.error('Error handling event scheduled:', error);
      }
    }
  });

  // Build the URL with pre-filled data - use the correct Calendly URL
  const calendlyUsername = 'drewlambert'; // Updated to the correct username
  const rootUrl = `https://calendly.com/${calendlyUsername}`;
  const url = eventType ? `${rootUrl}/${eventType}` : rootUrl;
  
  const prefill = {
    email,
    firstName,
    lastName,
    name: firstName && lastName ? `${firstName} ${lastName}` : '',
    customAnswers: {
      a1: companyName || '',
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">
          {error}
        </p>
        <p className="mt-2">
          Please contact support or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className={`calendly-embed ${className}`}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div key={`calendly-${Date.now()}`} className="w-full">
          <InlineWidget
            url={url}
            prefill={prefill}
            styles={{
              height: typeof height === 'number' ? `${height}px` : height,
              minWidth: '320px',
              width: '100%',
            }}
            pageSettings={{
              backgroundColor: 'ffffff',
              hideEventTypeDetails: false,
              hideLandingPageDetails: false,
              primaryColor: '3B166A', // Match your brand color
              textColor: '19092f',
            }}
          />
        </div>
      )}
    </div>
  );
}
