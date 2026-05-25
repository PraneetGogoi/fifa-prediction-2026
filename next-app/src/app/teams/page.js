'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TEAMS } from '@/data/dashboardData';
import TiltCard from '@/components/TiltCard';
import styles from './TeamsGrid.module.css';

export default function TeamsPage() {
  return (
    <div className={styles.container}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className={styles.title}>NATIONS DATABASE</h1>
        <div className={styles.sub}>SELECT A TEAM FOR IN-DEPTH NEURAL ANALYSIS</div>
      </motion.div>

      <div className={styles.grid}>
        {TEAMS.map((team, i) => (
          <Link href={`/teams/${team.name.toLowerCase()}`} key={team.name} passHref>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <TiltCard className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.teamName}>{team.name}</span>
                  <span className={styles.rank}>WIN PROB: {(team.prob * 100).toFixed(1)}%</span>
                </div>
                
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Neural Rating</span>
                  <span className={styles.statValue}>{team.rating.toFixed(1)}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Market Value</span>
                  <span className={styles.statValue}>€{team.mv}M</span>
                </div>
                
                <div className={styles.confBadge}>{team.conf}</div>
              </TiltCard>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
