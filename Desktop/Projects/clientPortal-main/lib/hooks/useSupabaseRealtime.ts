'use client';

import { useEffect, useState } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type SupabaseTable = 'projects' | 'tasks' | 'comments' | 'attachments' | 'invoices' | 'contracts';
type SupabaseEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseSupabaseRealtimeOptions {
  table: SupabaseTable;
  event?: SupabaseEvent;
  filter?: string;
  filterValue?: string | number;
  onChange?: (payload: RealtimePostgresChangesPayload<any>) => void;
}

/**
 * A hook for subscribing to Supabase real-time changes
 * 
 * @param options Configuration options for the real-time subscription
 * @returns A utility object with the subscription channel
 */
export const useSupabaseRealtime = (options: UseSupabaseRealtimeOptions) => {
  const { table, event = '*', filter, filterValue, onChange } = options;
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Create a unique channel name
    const channelName = `public:${table}:${event}:${filter || 'all'}:${filterValue || 'all'}`;
    
    // Create a new subscription with the correct syntax
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
          ...(filter && filterValue ? { filter: `${filter}=eq.${filterValue}` } : {}),
        },
        (payload) => {
          console.log('Realtime change received:', payload);
          
          // Call the onChange callback if provided
          if (onChange) {
            onChange(payload);
          }
        }
      )
      .subscribe((status, err) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Error subscribing to realtime changes:', status, err);
          setError(err || new Error(`Failed to subscribe: ${status}`));
        } else {
          console.log(`Subscribed to ${table} changes`);
        }
      });

    // Store the channel for later use
    setChannel(subscription);

    // Cleanup on unmount
    return () => {
      if (subscription) {
        console.log(`Unsubscribing from ${table} changes`);
        supabase.removeChannel(subscription);
      }
    };
  }, [table, event, filter, filterValue, onChange]);

  return { channel, error };
};
