'use client';
import { motion } from 'framer-motion';
import { TEAMS } from '@/data/dashboardData';
import styles from './ValueMatrix.module.css';

export default function ValueMatrix({ activeTeam }) {
  const maxMV = 1100; // max market value
  const maxProb = 0.90; // max win probability

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Squad Value vs. Prediction</div>
        <div className={styles.sub}>EFFICIENCY MATRIX (MARKET VALUE VS WIN PROB)</div>
      </div>
      <div className={styles.matrixContainer}>
        {/* Quadrant backgrounds */}
        <div className={styles.quadrant} style={{ bottom: '50%', left: 0, background: 'rgba(0, 225, 255, 0.05)'}}>
          <span className={styles.quadLabel}>OVER-PERFORMING<br/>(High Prob, Low Cost)</span>
        </div>
        <div className={styles.quadrant} style={{ bottom: '50%', left: '50%', background: 'rgba(255, 201, 0, 0.03)'}}>
          <span className={styles.quadLabel}>ELITE TITANS<br/>(High Prob, High Cost)</span>
        </div>
        <div className={styles.quadrant} style={{ bottom: 0, left: 0, background: 'rgba(255, 255, 255, 0.01)'}}>
          <span className={styles.quadLabel}>UNDERDOGS<br/>(Low Prob, Low Cost)</span>
        </div>
        <div className={styles.quadrant} style={{ bottom: 0, left: '50%', background: 'rgba(255, 0, 127, 0.03)'}}>
          <span className={styles.quadLabel}>UNDER-PERFORMING<br/>(Low Prob, High Cost)</span>
        </div>

        {/* Axes lines */}
        <div className={styles.axisX} />
        <div className={styles.axisY} />

        {/* Plot points */}
        {TEAMS.map((team, i) => {
          const x = (team.mv / maxMV) * 100;
          const y = (team.prob / maxProb) * 100;
          const isActive = team.name === activeTeam;
          return (
            <motion.div
              key={team.name}
              className={`${styles.point} ${isActive ? styles.pointActive : ''}`}
              style={{ left: `${x}%`, bottom: `${y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isActive ? 1.5 : 1, opacity: isActive ? 1 : 0.6 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              whileHover={{ scale: 2, opacity: 1, zIndex: 20 }}
              title={`${team.name}: €${team.mv}M / ${(team.prob*100).toFixed(1)}%`}
            >
              {isActive && <div className={styles.pulse} />}
              <span className={styles.pointLabel}>{team.name.substring(0,3).toUpperCase()}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
