import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  
  const supabase = await createClient();
  
  // Check user auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found' },
      { status: 401 }
    );
  }
  
  // Verify user is owner
  const { data: member, error: memberError } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();
    
  if (memberError || member?.role !== 'owner') {
    return NextResponse.json(
      { success: false, message: 'Access denied' },
      { status: 403 }
    );
  }
  
  // Fetch logs
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  
  const { data, error, count } = await supabase
    .from('workspace_activity_logs')
    .select('*, profiles(display_name, avatar_url, email)', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .range(start, end);
    
  if (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch workspace logs' },
      { status: 500 }
    );
  }
  
  return NextResponse.json({
    success: true,
    message: 'Logs fetched successfully',
    data,
    totalCount: count || 0
  });
}
