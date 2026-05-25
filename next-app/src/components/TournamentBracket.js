'use client';
import { motion } from 'framer-motion';
import styles from './TournamentBracket.module.css';

export default function TournamentBracket({ activeTeam }) {
  const isWinner = activeTeam === 'Spain' || activeTeam === 'France' || activeTeam === 'Brazil' || activeTeam === 'England' || activeTeam === 'Argentina';
  
  const stages = [
    { name: 'ROUND OF 16', opponent: 'Japan', prob: '82%' },
    { name: 'QUARTER FINAL', opponent: 'Germany', prob: '68%' },
    { name: 'SEMI FINAL', opponent: 'Netherlands', prob: '55%' },
    { name: 'FINAL', opponent: isWinner ? 'Portugal' : 'France', prob: isWinner ? '51%' : '38%' }
  ];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Predictive Path to Glory</div>
        <div className={styles.sub}>{activeTeam} • TOURNAMENT SIMULATION</div>
      </div>
      
      <div className={styles.bracketContainer}>
        {stages.map((stage, i) => (
          <div key={stage.name} className={styles.stage}>
            <div className={styles.stageLabel}>{stage.name}</div>
            <motion.div 
              className={`${styles.matchNode} ${i === 3 ? styles.finalNode : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div className={styles.teamRow}>
                <span className={styles.teamName}>{activeTeam.substring(0,3).toUpperCase()}</span>
                <span className={styles.teamProb}>{stage.prob}</span>
              </div>
              <div className={styles.vsRow}>VS</div>
              <div className={styles.teamRow}>
                <span className={styles.teamName}>{stage.opponent.substring(0,3).toUpperCase()}</span>
                <span className={styles.teamProb} style={{color: 'var(--text-mid)'}}>
                  {(100 - parseInt(stage.prob))}%
                </span>
              </div>
            </motion.div>
            {i < stages.length - 1 && (
              <div className={styles.connector}>
                <motion.div 
                  className={styles.connectorLine}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: i * 0.2 + 0.1, duration: 0.3 }}
                />
              </div>
            )}
          </div>
        ))}
        
        {/* Trophy Node */}
        <div className={styles.stage}>
          <div className={styles.stageLabel}>CHAMPION</div>
          <motion.div 
            className={styles.trophyNode}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
          >
            <div className={styles.trophyIcon}>🏆</div>
            <div className={styles.winnerName}>{isWinner ? activeTeam.substring(0,3).toUpperCase() : 'FRA'}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
