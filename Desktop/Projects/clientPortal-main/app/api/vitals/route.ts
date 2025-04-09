import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * API route to store Web Vitals metrics
 * POST /api/vitals
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, delta, id, userAgent, pathname } = body;
    
    // Store metrics in database
    const { error } = await supabase
      .from('web_vitals')
      .insert({
        name,
        value: delta,
        page_path: pathname,
        user_agent: userAgent,
        unique_id: id,
        created_at: new Date().toISOString()
      });
      
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing Web Vitals metrics:', error);
    return NextResponse.json(
      { error: 'Failed to store Web Vitals metrics' },
      { status: 500 }
    );
  }
}
