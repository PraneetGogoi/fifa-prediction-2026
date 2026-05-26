import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request, { params }) {
  const { team_name } = params;
  
  if (!team_name) {
    return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
  }

  // Fetch from the squad_players table matching the team_name (case-insensitive)
  const { data, error } = await supabase
    .from('squad_players')
    .select('*')
    .ilike('team_name', team_name)
    .order('rating', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ roster: data });
}
