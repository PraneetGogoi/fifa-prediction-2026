'use client';
import { motion } from 'framer-motion';
import styles from './PredictionLeaderboard.module.css';

// Mock data representing top sandbox predictors
const LEADERS = [
  { id: 1, name: 'Alex_Futbol', pick: 'Brazil', score: 98.4 },
  { id: 2, name: 'DeepKick_Master', pick: 'France', score: 96.2 },
  { id: 3, name: 'MessiGoat99', pick: 'Argentina', score: 94.8 },
  { id: 4, name: 'TacticsNerd', pick: 'Spain', score: 91.1 },
  { id: 5, name: 'Oracle2026', pick: 'England', score: 89.5 },
];

export default function PredictionLeaderboard() {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>TOP PREDICTORS</div>
          <div className={styles.sub}>COMMUNITY LEADERBOARD</div>
        </div>
      </div>

      <div className={styles.tableHeader}>
        <div>#</div>
        <div>User</div>
        <div>Top Pick</div>
        <div style={{ textAlign: 'right' }}>Score</div>
      </div>

      <div className={styles.list}>
        {LEADERS.map((user, index) => (
          <motion.div 
            key={user.id} 
            className={styles.row}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className={styles.rank}>{index + 1}</div>
            <div className={styles.user}>
              <div className={styles.avatar}>
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              {user.name}
            </div>
            <div className={styles.pick}>{user.pick}</div>
            <div className={styles.score}>{user.score}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
