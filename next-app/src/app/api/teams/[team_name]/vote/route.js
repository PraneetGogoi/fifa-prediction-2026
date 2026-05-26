import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request, { params }) {
  const { team_name } = params;
  
  if (!team_name) {
    return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
  }

  // Count BULL votes
  const { count: bullCount, error: err1 } = await supabase
    .from('team_votes')
    .select('*', { count: 'exact', head: true })
    .ilike('team_name', team_name)
    .eq('vote_type', 'BULL');

  // Count BEAR votes
  const { count: bearCount, error: err2 } = await supabase
    .from('team_votes')
    .select('*', { count: 'exact', head: true })
    .ilike('team_name', team_name)
    .eq('vote_type', 'BEAR');

  if (err1 || err2) {
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }

  return NextResponse.json({ bull: bullCount || 0, bear: bearCount || 0 });
}

export async function POST(request, { params }) {
  const { team_name } = params;
  
  try {
    const { vote_type } = await request.json();

    if (!team_name || !vote_type) {
      return NextResponse.json({ error: 'Missing team_name or vote_type' }, { status: 400 });
    }

    if (vote_type !== 'BULL' && vote_type !== 'BEAR') {
      return NextResponse.json({ error: 'vote_type must be BULL or BEAR' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('team_votes')
      .insert([{ team_name, vote_type }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
