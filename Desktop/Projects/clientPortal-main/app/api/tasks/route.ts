import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const projectId = searchParams.get('project_id');
    
    // Build the query
    let query = supabase
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
        project_id,
        projects(name),
        created_at, 
        updated_at
      `)
      .order('created_at', { ascending: false });
    
    // Add filters if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    // Execute the query
    const { data: tasks, error } = await query;
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tasks' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    
    // Get the current user ID
    const userId = session.user.id;
    
    // Get the request body
    const { 
      title, 
      description, 
      status, 
      priority, 
      dueDate, 
      estimatedHours,
      projectId
    } = await request.json();
    
    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Task title is required' }, 
        { status: 400 }
      );
    }
    
    // Insert the new task
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        status: status || 'Pending',
        priority: priority || 'Medium',
        due_date: dueDate,
        estimated_hours: estimatedHours,
        project_id: projectId,
        client_id: userId,
        assigned_by: userId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json(
        { error: 'Failed to create task' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}
