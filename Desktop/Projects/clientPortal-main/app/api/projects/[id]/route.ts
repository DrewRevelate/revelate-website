import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    // Get the project
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        id, 
        name, 
        description, 
        status, 
        start_date, 
        target_end_date, 
        actual_end_date, 
        completion_percentage, 
        created_at, 
        updated_at
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching project:', error);
      return NextResponse.json(
        { error: 'Failed to fetch project' }, 
        { status: 500 }
      );
    }
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' }, 
        { status: 404 }
      );
    }
    
    // Get tasks for this project
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        id, 
        title, 
        description, 
        status, 
        priority, 
        due_date, 
        estimated_hours, 
        actual_hours,
        created_at, 
        updated_at
      `)
      .eq('project_id', id)
      .order('created_at', { ascending: false });
    
    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
    }
    
    // Get meetings for this project
    const { data: meetings, error: meetingsError } = await supabase
      .from('meetings')
      .select(`
        id, 
        title, 
        description, 
        start_time, 
        end_time, 
        status, 
        meeting_link,
        recording_link,
        transcript_link,
        created_at, 
        updated_at
      `)
      .eq('project_id', id)
      .order('start_time', { ascending: false });
    
    if (meetingsError) {
      console.error('Error fetching meetings:', meetingsError);
    }
    
    // Get documents for this project
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select(`
        id, 
        name, 
        description, 
        file_path, 
        file_type, 
        file_size, 
        category,
        status,
        created_at, 
        updated_at
      `)
      .eq('project_id', id)
      .order('created_at', { ascending: false });
    
    if (documentsError) {
      console.error('Error fetching documents:', documentsError);
    }
    
    // Get project updates
    const { data: updates, error: updatesError } = await supabase
      .from('project_updates')
      .select(`
        id, 
        content, 
        created_at, 
        updated_at,
        user_id
      `)
      .eq('project_id', id)
      .order('created_at', { ascending: false });
    
    if (updatesError) {
      console.error('Error fetching project updates:', updatesError);
    }
    
    return NextResponse.json({
      project,
      tasks: tasks || [],
      meetings: meetings || [],
      documents: documents || [],
      updates: updates || []
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    // Get the request body
    const { name, description, status, startDate, targetEndDate, actualEndDate, completionPercentage } = await request.json();
    
    // Update the project
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        name,
        description,
        status,
        start_date: startDate,
        target_end_date: targetEndDate,
        actual_end_date: actualEndDate,
        completion_percentage: completionPercentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json(
        { error: 'Failed to update project' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    // Delete the project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json(
        { error: 'Failed to delete project' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}
