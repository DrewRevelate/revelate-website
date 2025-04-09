import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// Type definition for Calendly webhook payload
interface CalendlyWebhookPayload {
  event: 'invitee.created' | 'invitee.canceled';
  payload: {
    event_type: {
      uuid: string;
      kind: string;
      slug: string;
      name: string;
      duration: number;
      owner: {
        type: string;
        uuid: string;
      };
    };
    event: {
      uuid: string;
      start_time: string;
      end_time: string;
      created_at: string;
      location: {
        type: string;
        join_url?: string;
      };
      canceled?: boolean;
      canceler_name?: string;
      cancel_reason?: string;
    };
    invitee: {
      uuid: string;
      first_name: string;
      last_name: string;
      email: string;
      text_reminder_number: string | null;
      timezone: string;
      created_at: string;
      is_reschedule: boolean;
      payments: any[];
      cancel_url: string;
      reschedule_url: string;
    };
    questions_and_answers: Array<{
      question: string;
      answer: string;
    }>;
    questions_and_responses: {
      [key: string]: string;
    };
    tracking: {
      utm_campaign: string | null;
      utm_source: string | null;
      utm_medium: string | null;
      utm_content: string | null;
      utm_term: string | null;
      salesforce_uuid: string | null;
    };
    old_invitee?: {
      uuid: string;
      first_name: string;
      last_name: string;
      email: string;
    };
    new_invitee?: {
      uuid: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const webhookData: CalendlyWebhookPayload = await request.json();
    
    // Log the webhook payload for debugging
    console.log('Received Calendly webhook:', webhookData.event);
    
    // Process based on event type
    if (webhookData.event === 'invitee.created') {
      await handleEventCreated(supabase, webhookData.payload);
    } else if (webhookData.event === 'invitee.canceled') {
      await handleEventCanceled(supabase, webhookData.payload);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Calendly webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' }, 
      { status: 500 }
    );
  }
}

async function handleEventCreated(supabase: any, payload: CalendlyWebhookPayload['payload']) {
  try {
    // Calculate duration in minutes
    const startTime = new Date(payload.event.start_time);
    const endTime = new Date(payload.event.end_time);
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    
    // Extract company name from custom questions if provided
    let companyName = '';
    const companyQuestion = payload.questions_and_answers.find(
      qa => qa.question.toLowerCase().includes('company') || 
            qa.question.toLowerCase().includes('organization')
    );
    
    if (companyQuestion) {
      companyName = companyQuestion.answer;
    }

    // Get meeting title from event type name
    const meetingTitle = payload.event_type.name;
    
    // Try to find a contact by email in our database (check both public and app schemas if available)
    let contactId = null;
    let companyId = null;
    let contactFirstName = payload.invitee.first_name;
    let contactLastName = payload.invitee.last_name;
    
    // First check the public schema
    try {
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .select('id, company_id, first_name, last_name')
        .eq('email', payload.invitee.email)
        .limit(1);

      if (!contactError && contactData && contactData.length > 0) {
        contactId = contactData[0].id;
        companyId = contactData[0].company_id;
        
        // Use DB values if available
        if (contactData[0].first_name) contactFirstName = contactData[0].first_name;
        if (contactData[0].last_name) contactLastName = contactData[0].last_name;
      }
    } catch (error) {
      console.error("Error checking contacts table:", error);
    }
    
    // Then check app schema if no contact found
    if (!contactId) {
      try {
        // Check for profiles in app schema if available
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, company, first_name, last_name')
          .eq('email', payload.invitee.email)
          .limit(1);

        if (!profileError && profileData && profileData.length > 0) {
          contactId = profileData[0].id;
          companyId = profileData[0].company;
          
          // Use DB values if available
          if (profileData[0].first_name) contactFirstName = profileData[0].first_name;
          if (profileData[0].last_name) contactLastName = profileData[0].last_name;
        }
      } catch (error) {
        console.error("Error checking profiles table:", error);
      }
    }

    // Create meeting in public schema if available
    try {
      const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          title: meetingTitle,
          description: `Scheduled via Calendly with ${contactFirstName} ${contactLastName}`,
          meeting_date: payload.event.start_time,
          meeting_link: payload.event.location.join_url || '',
          contact_id: contactId,
          company_id: companyId,
          status: 'scheduled',
          calendly_event_uuid: payload.event.uuid,
          calendly_invitee_uuid: payload.invitee.uuid,
          reschedule_url: payload.invitee.reschedule_url,
          cancel_url: payload.invitee.cancel_url,
        })
        .select();

      if (meetingError) {
        console.error('Error creating meeting in public schema:', meetingError);
      } else {
        console.log('Successfully created meeting in public schema');
      }
    } catch (error) {
      console.error("Error inserting into meetings table:", error);
    }
    
    // Create appointment in public schema
    try {
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          title: meetingTitle,
          description: `Scheduled via Calendly with ${contactFirstName} ${contactLastName}`,
          start_time: payload.event.start_time,
          end_time: payload.event.end_time,
          duration: durationMinutes,
          is_video_meeting: payload.event.location.type === 'zoom' || 
                           payload.event.location.type === 'google_meet',
          meeting_link: payload.event.location.join_url || '',
          client_id: contactId,
          status: 'scheduled',
          calendly_event_uuid: payload.event.uuid,
          calendly_invitee_uuid: payload.invitee.uuid,
          reschedule_url: payload.invitee.reschedule_url,
          cancel_url: payload.invitee.cancel_url,
        });

      if (appointmentError) {
        console.error('Error creating appointment in public schema:', appointmentError);
      } else {
        console.log('Successfully created appointment in public schema');
      }
    } catch (error) {
      console.error("Error inserting into appointments table:", error);
    }

    // Try to create in app schema if available
    try {
      // First check if meetings table exists in app schema
      const { data: schemaData } = await supabase
        .rpc('check_table_exists', { 
          schema_name: 'app', 
          table_name: 'meetings' 
        });
        
      if (schemaData && schemaData.exists) {
        await supabase.rpc('create_app_meeting', {
          p_title: meetingTitle,
          p_description: `Scheduled via Calendly with ${contactFirstName} ${contactLastName}`,
          p_start_time: payload.event.start_time,
          p_end_time: payload.event.end_time,
          p_meeting_link: payload.event.location.join_url || '',
          p_client_id: contactId,
          p_status: 'scheduled',
          p_uuid: payload.event.uuid,
          p_invitee_uuid: payload.invitee.uuid,
          p_reschedule_url: payload.invitee.reschedule_url,
          p_cancel_url: payload.invitee.cancel_url
        });
        
        console.log('Successfully created meeting in app schema');
      }
    } catch (error) {
      console.error("Error inserting into app.meetings table:", error);
    }

    // If no matching contact, create a new one
    if (!contactId && payload.invitee.email) {
      try {
        // Create new contact in public schema
        const { data: newContact, error: newContactError } = await supabase
          .from('contacts')
          .insert({
            first_name: contactFirstName,
            last_name: contactLastName,
            email: payload.invitee.email,
            company_name: companyName,
          })
          .select();

        if (newContactError) {
          console.error('Error creating new contact:', newContactError);
        } else if (newContact && newContact.length > 0) {
          contactId = newContact[0].id;
          
          // Update the meeting with the new contact ID
          await supabase
            .from('meetings')
            .update({ contact_id: contactId })
            .eq('calendly_invitee_uuid', payload.invitee.uuid);
            
          // Update the appointment with the new contact ID
          await supabase
            .from('appointments')
            .update({ client_id: contactId })
            .eq('calendly_invitee_uuid', payload.invitee.uuid);
        }
      } catch (error) {
        console.error("Error creating or updating contact:", error);
      }
    }
  } catch (error) {
    console.error('Error handling event creation:', error);
  }
}

async function handleEventCanceled(supabase: any, payload: CalendlyWebhookPayload['payload']) {
  try {
    // Update meeting status to canceled in public schema
    try {
      await supabase
        .from('meetings')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          cancel_reason: payload.event.cancel_reason || 'Canceled by invitee'
        })
        .eq('calendly_invitee_uuid', payload.invitee.uuid);
        
      console.log('Successfully updated meeting status in public schema');
    } catch (error) {
      console.error('Error updating meeting status in public schema:', error);
    }

    // Update appointment status to canceled in public schema
    try {
      await supabase
        .from('appointments')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          cancel_reason: payload.event.cancel_reason || 'Canceled by invitee'
        })
        .eq('calendly_invitee_uuid', payload.invitee.uuid);
        
      console.log('Successfully updated appointment status in public schema');
    } catch (error) {
      console.error('Error updating appointment status in public schema:', error);
    }
    
    // Try to update in app schema if available
    try {
      await supabase.rpc('cancel_app_meeting', {
        p_invitee_uuid: payload.invitee.uuid,
        p_cancel_reason: payload.event.cancel_reason || 'Canceled by invitee',
        p_canceled_at: new Date().toISOString()
      });
      
      console.log('Successfully updated meeting status in app schema');
    } catch (error) {
      console.error('Error updating meeting status in app schema:', error);
    }
  } catch (error) {
    console.error('Error handling event cancellation:', error);
  }
}

// We need to create some helper functions in the database
export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Create helper function to check if a table exists
    await supabase.rpc('create_check_table_function');
    
    // Create helper functions for app schema
    await supabase.rpc('create_app_schema_functions');
    
    return NextResponse.json({ success: true, message: 'Helper functions created' });
  } catch (error) {
    console.error('Error creating helper functions:', error);
    return NextResponse.json(
      { error: 'Failed to create helper functions' }, 
      { status: 500 }
    );
  }
}
