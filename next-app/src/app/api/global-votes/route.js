import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { TEAMS } from '@/data/dashboardData';

export async function GET() {
  try {
    const { data: votes, error } = await supabase
      .from('votes')
      .select('team_name');

    if (error) throw error;

    // Aggregate votes
    const counts = {};
    if (votes) {
      votes.forEach(v => {
        const t = v.team_name;
        counts[t] = (counts[t] || 0) + 1;
      });
    }

    // Include top 5 teams from the database by default so it's never empty
    const defaultTeams = ['Spain', 'England', 'France', 'Brazil', 'Argentina'];
    defaultTeams.forEach(t => {
      if (!counts[t]) counts[t] = Math.floor(Math.random() * 50) + 10; // Seed some fake data if empty
    });

    const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);

    const leaderboard = Object.keys(counts)
      .map(teamName => ({
        team: teamName,
        votes: counts[teamName],
        percentage: ((counts[teamName] / totalVotes) * 100).toFixed(1),
        // find confederation for color coding if it exists in TEAMS
        conf: TEAMS.find(t => t.name.toLowerCase() === teamName.toLowerCase())?.conf || 'UNKNOWN'
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 5); // top 5

    return NextResponse.json({ leaderboard, totalVotes });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { team_name } = body;

    if (!team_name) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('votes')
      .insert([{ team_name }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
