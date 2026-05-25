'use client';
import { motion } from 'framer-motion';
import CommunityVotes from '@/components/CommunityVotes';
import LiveChat from '@/components/LiveChat';
import HallOfFame from '@/components/HallOfFame';
import styles from './CommunityPage.module.css';

export default function CommunityPage() {
  return (
    <div className={styles.container}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className={styles.title}>COMMUNITY HUB</h1>
        <div className={styles.sub}>LIVE MULTIPLAYER INTERACTION & VOTING</div>
      </motion.div>

      <div className={styles.grid}>
        <div className={styles.col8}>
          <LiveChat />
        </div>
        <div className={styles.col4}>
          <CommunityVotes />
        </div>
        <div className={styles.col12} style={{ gridColumn: 'span 12', marginTop: '20px' }}>
          <HallOfFame />
        </div>
      </div>
    </div>
  );
}
