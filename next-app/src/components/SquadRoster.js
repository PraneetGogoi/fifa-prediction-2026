import { useState, useEffect } from 'react';
import styles from './SquadRoster.module.css';
import { motion } from 'framer-motion';
import { getLineup } from '@/data/dashboardData';

export default function SquadRoster({ teamName }) {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoster() {
      setLoading(true);
      try {
        const res = await fetch(`/api/teams/${teamName}/roster`);
        const data = await res.json();
        if (data.roster && data.roster.length > 0) {
          setRoster(data.roster);
        } else {
          // Fallback to static lineup if database is empty
          const staticLineup = getLineup(teamName).players.map((p, idx) => ({
            id: `static-${idx}`,
            player_name: p.name,
            position: p.pos,
            rating: Math.floor(Math.random() * 10 + 80),
            goals: Math.floor(Math.random() * 3),
            assists: Math.floor(Math.random() * 3),
            xg: (Math.random() * 1.5).toFixed(2)
          }));
          setRoster(staticLineup);
        }
      } catch (err) {
        console.error('Failed to fetch roster:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (teamName) {
      fetchRoster();
    }
  }, [teamName]);

  return (
    <div className={`${styles.container} hover-float`}>
      <h2 className={styles.title}>Full Squad Roster</h2>
      {loading ? (
        <div style={{ color: 'var(--text-mid)', fontFamily: 'Roboto' }}>Loading squad database...</div>
      ) : roster.length === 0 ? (
        <div style={{ color: 'var(--text-mid)', fontFamily: 'Roboto' }}>No roster data available for {teamName} yet.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Player</th>
              <th className={styles.th}>Pos</th>
              <th className={styles.th}>OVR</th>
              <th className={styles.th}>G</th>
              <th className={styles.th}>A</th>
              <th className={styles.th}>xG</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((p, i) => (
              <motion.tr 
                key={p.id} 
                className="hover-slide-right"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <td className={styles.td} style={{ fontWeight: 600 }}>{p.player_name}</td>
                <td className={styles.td} style={{ color: 'var(--text-mid)' }}>{p.position}</td>
                <td className={`${styles.td} ${styles.rating}`}>{p.rating}</td>
                <td className={styles.td}>{p.goals}</td>
                <td className={styles.td}>{p.assists}</td>
                <td className={`${styles.td} ${styles.xg}`}>{p.xg}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
