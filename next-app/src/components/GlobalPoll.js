'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './GlobalPoll.module.css';
import { CONF_COLORS, TEAMS } from '@/data/dashboardData';

export default function GlobalPoll() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchPollData();
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchPollData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPollData = async () => {
    try {
      const res = await fetch('/api/global-votes');
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
        setTotal(data.totalVotes);
      }
    } catch (err) {
      console.error('Failed to fetch global poll', err);
    }
  };

  const handleVote = async () => {
    if (!selectedTeam || hasVoted) return;
    setIsVoting(true);
    try {
      await fetch('/api/global-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_name: selectedTeam })
      });
      setHasVoted(true);
      await fetchPollData(); // instant refresh
    } catch (err) {
      console.error(err);
    } finally {
      setIsVoting(false);
    }
  };

  // Ensure TEAMS are sorted alphabetically for the dropdown
  const sortedTeams = [...TEAMS].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>GLOBAL FAN POLL</div>
        <div className={styles.subtitle}>Who will win the 2026 World Cup?</div>
      </div>

      <div className={styles.leaderboard}>
        {leaderboard.map((item, index) => {
          const color = CONF_COLORS[item.conf] || 'var(--blue-light)';
          return (
            <motion.div 
              key={item.team} 
              className={styles.voteRow}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.teamHeader}>
                <span className={styles.teamName}>{item.team}</span>
                <span className={styles.percentage}>{item.percentage}% ({item.votes})</span>
              </div>
              <div className={styles.barTrack}>
                <motion.div 
                  className={styles.barFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, type: 'spring' }}
                  style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <select 
          className={styles.select}
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          disabled={hasVoted}
        >
          <option value="">Select a team...</option>
          {sortedTeams.map(t => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
        <button 
          className={styles.voteBtn} 
          onClick={handleVote}
          disabled={!selectedTeam || hasVoted || isVoting}
        >
          {hasVoted ? 'VOTED' : 'VOTE'}
        </button>
      </div>
    </div>
  );
}
