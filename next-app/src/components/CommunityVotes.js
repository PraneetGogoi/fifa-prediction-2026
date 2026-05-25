'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';
import { TEAMS } from '@/data/dashboardData';
import styles from './CommunityVotes.module.css';

export default function CommunityVotes() {
  const [votes, setVotes] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0].name);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch initial vote counts
    const fetchVotes = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('team_name');
      
      if (!error && data) {
        const counts = {};
        data.forEach(v => {
          counts[v.team_name] = (counts[v.team_name] || 0) + 1;
        });
        setVotes(counts);
      }
    };
    fetchVotes();

    // 2. Subscribe to new votes
    const channel = supabase
      .channel('public:votes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes' },
        (payload) => {
          const team = payload.new.team_name;
          setVotes(prev => ({
            ...prev,
            [team]: (prev[team] || 0) + 1
          }));
        }
      )
      .subscribe();

    // Check local storage for previous vote
    if (typeof window !== 'undefined' && localStorage.getItem('hasVoted')) {
      setHasVoted(true);
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVote = async () => {
    if (hasVoted || isSubmitting) return;
    setIsSubmitting(true);

    const { error } = await supabase
      .from('votes')
      .insert([{ team_name: selectedTeam }]);

    if (!error) {
      setHasVoted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hasVoted', 'true');
      }
    } else {
      console.error('Error submitting vote:', error);
    }
    setIsSubmitting(false);
  };

  // Sort and prep data for bars
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0) || 1; // avoid / 0
  const sortedTeams = TEAMS.map(t => ({
    name: t.name,
    count: votes[t.name] || 0
  })).sort((a, b) => b.count - a.count).slice(0, 8); // Show top 8 voted

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Community vs. AI</div>
        <div className={styles.sub}>CROWDSOURCED PREDICTIONS</div>
      </div>

      <div className={styles.content}>
        <div className={styles.voteForm}>
          <span className={styles.voteLabel}>Who wins 2026?</span>
          <select 
            className={styles.teamSelect} 
            value={selectedTeam} 
            onChange={e => setSelectedTeam(e.target.value)}
            disabled={hasVoted}
          >
            {TEAMS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
          <button 
            className={styles.voteBtn} 
            onClick={handleVote} 
            disabled={hasVoted || isSubmitting}
          >
            {hasVoted ? 'VOTED ✓' : 'CAST VOTE'}
          </button>
        </div>

        <div className={styles.resultsList}>
          {sortedTeams.map((team, i) => {
            const pct = (team.count / totalVotes) * 100;
            return (
              <div key={team.name} className={styles.resultRow}>
                <div className={styles.rowHeader}>
                  <span className={styles.teamName}>{i + 1}. {team.name}</span>
                  <span className={styles.voteCount}>{team.count} Votes</span>
                </div>
                <div className={styles.barTrack}>
                  <motion.div 
                    className={styles.barFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, type: "spring" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
