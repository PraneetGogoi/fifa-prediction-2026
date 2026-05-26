import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { TEAMS } from '@/data/dashboardData';

export async function GET() {
  try {
    // Fetch latest 200 messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select('content')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    // Create a frequency map
    const freq = {};
    
    // Seed with some default FIFA 2026 related topics to ensure it's never empty
    const seedTopics = ['#WorldCup2026', 'Deep-Kick AI', 'Finals', 'Group Stage', 'Golden Boot'];
    seedTopics.forEach(t => freq[t] = Math.floor(Math.random() * 15) + 5);

    // Analyze messages for team names or hashtags
    const teamNames = TEAMS.map(t => t.name.toLowerCase());
    
    if (messages) {
      messages.forEach(msg => {
        const text = msg.content.toLowerCase();
        
        // Find team mentions
        TEAMS.forEach(team => {
          if (text.includes(team.name.toLowerCase())) {
            const key = `#${team.name}`;
            freq[key] = (freq[key] || 0) + 3; // weight mentions heavily
          }
        });

        // Find hashtags
        const words = text.split(/\s+/);
        words.forEach(word => {
          if (word.startsWith('#') && word.length > 2) {
            const clean = word.replace(/[^a-zA-Z0-9#]/g, '');
            freq[clean] = (freq[clean] || 0) + 2;
          }
        });
      });
    }

    // Convert map to array and sort
    const trending = Object.keys(freq)
      .map(topic => ({ text: topic, value: freq[topic] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15); // Top 15 keywords

    return NextResponse.json({ trending });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
