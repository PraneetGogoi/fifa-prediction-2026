'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './Landing.module.css';
import GlobalPoll from '@/components/GlobalPoll';
import LiveFeed from '@/components/LiveFeed';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.bgGlow}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className={styles.hero}>
        <motion.div 
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Project Genesis
        </motion.div>
        
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          DEEP-KICK <span>2026</span>
        </motion.h1>
        
        <motion.p 
          className={styles.desc}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Harness the power of machine intelligence. A real-time, fully interactive oracle that simulates millions of scenarios to predict the ultimate champion of the 2026 FIFA World Cup.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/dashboard" className={styles.launchBtn}>
            INITIALIZE DASHBOARD
          </Link>
        </motion.div>
      </div>

      <div className={styles.dashboardGrid}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <GlobalPoll />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
        >
          <LiveFeed />
        </motion.div>
      </div>
    </div>
  );
}
