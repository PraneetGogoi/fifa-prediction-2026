import { useState, useEffect } from 'react';
import styles from './FanSentiment.module.css';

export default function FanSentiment({ teamName }) {
  const [bull, setBull] = useState(0);
  const [bear, setBear] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    async function fetchVotes() {
      try {
        const res = await fetch(`/api/teams/${teamName}/vote`);
        const data = await res.json();
        setBull(data.bull || 0);
        setBear(data.bear || 0);
      } catch (err) {
        console.error('Failed to fetch votes:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (teamName) {
      fetchVotes();
    }
  }, [teamName]);

  const handleVote = async (type) => {
    if (voted) return;
    setVoted(true);
    
    // Optimistic UI update
    if (type === 'BULL') setBull(prev => prev + 1);
    else setBear(prev => prev + 1);

    try {
      await fetch(`/api/teams/${teamName}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote_type: type })
      });
    } catch (err) {
      console.error('Failed to cast vote:', err);
      // Revert on error
      if (type === 'BULL') setBull(prev => prev - 1);
      else setBear(prev => prev - 1);
      setVoted(false);
    }
  };

  const total = bull + bear;
  const bullPct = total > 0 ? (bull / total) * 100 : 50;
  const bearPct = total > 0 ? (bear / total) * 100 : 50;

  return (
    <div className={`${styles.container} hover-float`}>
      <h2 className={styles.title}>Global Fan Sentiment</h2>
      
      <div className={styles.actions}>
        <button 
          className={styles.btnBull} 
          onClick={() => handleVote('BULL')}
          disabled={voted}
          style={{ opacity: voted ? 0.5 : 1 }}
        >
          {voted ? 'VOTED BULL' : 'BULLISH (WIN)'}
        </button>
        <button 
          className={styles.btnBear} 
          onClick={() => handleVote('BEAR')}
          disabled={voted}
          style={{ opacity: voted ? 0.5 : 1 }}
        >
          {voted ? 'VOTED BEAR' : 'BEARISH (LOSE)'}
        </button>
      </div>

      <div className={styles.barContainer}>
        <div className={styles.bullFill} style={{ width: `${bullPct}%` }} />
        <div className={styles.bearFill} style={{ width: `${bearPct}%` }} />
      </div>
      
      <div className={styles.statsRow}>
        <span className={styles.bullText}>{bull} Votes ({bullPct.toFixed(1)}%)</span>
        <span className={styles.bearText}>{bear} Votes ({bearPct.toFixed(1)}%)</span>
      </div>
    </div>
  );
}
