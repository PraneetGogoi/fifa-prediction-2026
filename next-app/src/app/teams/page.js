'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TEAMS, CONF_COLORS } from '@/data/dashboardData';
import TiltCard from '@/components/TiltCard';
import styles from './TeamsGrid.module.css';

export default function TeamsPage() {
  return (
    <div className={styles.container}>
      <motion.div className={styles.hero} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, type: "spring" }}>
        <h1 className={styles.title}>NATIONS DATABASE</h1>
        <div className={styles.sub}>SELECT A TEAM FOR IN-DEPTH NEURAL ANALYSIS</div>
      </motion.div>

      <div className={styles.grid}>
        {TEAMS.map((team, i) => {
          const col = CONF_COLORS[team.conf] || 'white';
          return (
            <Link href={`/teams/${team.name.toLowerCase()}`} key={team.name} passHref>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
              >
                <TiltCard className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.teamName}>{team.name}</span>
                    <span className={styles.rank}>WIN: {(team.prob * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className={styles.statsGrid}>
                    <div className={styles.statCol}>
                      <span className={styles.statLabel}>Neural Rtg</span>
                      <span className={styles.statValue} style={{ color: col }}>{team.rating.toFixed(1)}</span>
                    </div>
                    <div className={styles.statCol}>
                      <span className={styles.statLabel}>Market Val</span>
                      <span className={styles.statValue}>€{team.mv}M</span>
                    </div>
                  </div>
                  
                  <div className={styles.confBadge} style={{ color: col }}>{team.conf}</div>
                </TiltCard>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
