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
    
    // Get the task
    const { data: task, error } = await supabase
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
        projects(id, name),
        assigned_to,
        created_at, 
        updated_at
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching task:', error);
      return NextResponse.json(
        { error: 'Failed to fetch task' }, 
        { status: 500 }
      );
    }
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' }, 
        { status: 404 }
      );
    }
    
    // Get comments for this task
    const { data: comments, error: commentsError } = await supabase
      .from('task_comments')
      .select(`
        id, 
        content, 
        created_at, 
        updated_at,
        user_id
      `)
      .eq('task_id', id)
      .order('created_at', { ascending: true });
    
    if (commentsError) {
      console.error('Error fetching task comments:', commentsError);
    }
    
    return NextResponse.json({
      task,
      comments: comments || []
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
    const { 
      title, 
      description, 
      status, 
      priority, 
      dueDate, 
      estimatedHours,
      actualHours,
      projectId 
    } = await request.json();
    
    // Update the task
    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        title,
        description,
        status,
        priority,
        due_date: dueDate,
        estimated_hours: estimatedHours,
        actual_hours: actualHours,
        project_id: projectId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      return NextResponse.json(
        { error: 'Failed to update task' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ task });
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
    
    // Delete the task
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json(
        { error: 'Failed to delete task' }, 
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
