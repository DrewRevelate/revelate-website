import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
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
    
    // Get all projects for the current user
    const { data: projects, error } = await supabase
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
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ projects });
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
    const { name, description, status, startDate, targetEndDate } = await request.json();
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' }, 
        { status: 400 }
      );
    }
    
    // Insert the new project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        status: status || 'Planning',
        start_date: startDate,
        target_end_date: targetEndDate,
        client_id: userId,
        completion_percentage: 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}
