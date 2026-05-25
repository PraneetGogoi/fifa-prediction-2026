'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { TEAMS, CONF_COLORS } from '@/data/dashboardData';
import styles from './RankingsSidebar.module.css';

const medals = ['gold', 'silver', 'bronze'];

export default function RankingsSidebar({ activeTeam, onTeamSelect }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <aside className={styles.sidebar} ref={ref}>
      <div className={styles.sidebarHead}>
        <span className={styles.sidebarTitle}>Win Probability Rank</span>
        <span className={styles.sidebarSub}>{TEAMS.length} NATIONS</span>
      </div>

      <div className={styles.rankList} id="rankList">
        {TEAMS.map((team, i) => (
          <motion.div
            key={team.name}
            className={`${styles.rankRow} ${activeTeam === team.name ? styles.active : ''}`}
            onClick={() => onTeamSelect(team.name)}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.04, duration: 0.4, ease: [0.25, 1, 0.3, 1] }}
            whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.04)' }}
          >
            <div className={`${styles.pos} ${medals[i] ? styles[medals[i]] : ''}`}>
              {i + 1}
            </div>
            <div
              className={styles.confBar}
              style={{ background: CONF_COLORS[team.conf] }}
            />
            <div className={styles.body}>
              <span className={styles.name}>{team.name}</span>
              <span className={styles.meta}>
                {team.conf} · {team.pts.toFixed(0)} pts
              </span>
            </div>
            <div className={styles.spark}>
              <div className={styles.sparkBar}>
                <motion.div
                  className={styles.sparkFill}
                  style={{ background: CONF_COLORS[team.conf] }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(team.prob / TEAMS[0].prob) * 100}%` } : {}}
                  transition={{ delay: i * 0.04 + 0.3, duration: 0.8, ease: [0.25, 1, 0.3, 1] }}
                />
              </div>
            </div>
            <div className={styles.probVal}>
              {(team.prob * 100).toFixed(1)}%
            </div>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
