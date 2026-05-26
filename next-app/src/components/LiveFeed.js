'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LiveFeed.module.css';
import { TEAMS } from '@/data/dashboardData';

export default function LiveFeed() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    // Generate initial feed
    const initial = Array.from({ length: 4 }).map(() => generatePrediction());
    setFeed(initial);

    // Add new prediction every 3.5 seconds
    const interval = setInterval(() => {
      setFeed(prev => [generatePrediction(), ...prev].slice(0, 8)); // keep last 8
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const generatePrediction = () => {
    const t1 = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    let t2 = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    while (t2.name === t1.name) {
      t2 = TEAMS[Math.floor(Math.random() * TEAMS.length)];
    }

    const t1Prob = (t1.prob / (t1.prob + t2.prob)) * 100;
    const isDraw = Math.random() > 0.8;
    
    let result = '';
    if (isDraw) {
      result = `Draw Predicted (Prob: 34.2%)`;
    } else {
      const winner = t1Prob > 50 ? t1.name : t2.name;
      const prob = Math.max(t1Prob, 100 - t1Prob).toFixed(1);
      result = `${winner} to win (Prob: ${prob}%)`;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      matchup: `${t1.name} vs ${t2.name}`,
      result,
      time: new Date().toISOString().split('T')[1].substring(0, 12) + 'Z'
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.blinker} />
          LIVE NEURAL FEED
        </div>
      </div>
      
      <div className={styles.feedContainer}>
        <div className={styles.feedList}>
          <AnimatePresence>
            {feed.map((item) => (
              <motion.div
                key={item.id}
                className={styles.feedItem}
                initial={{ opacity: 0, height: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className={styles.itemHeader}>
                  <span>SIMULATION COMPLETED</span>
                  <span className={styles.timestamp}>{item.time}</span>
                </div>
                <div className={styles.matchup}>{item.matchup}</div>
                <div className={styles.prediction} dangerouslySetInnerHTML={{ __html: item.result.replace(/(Prob: [\d.]+%)/, '<span>$1</span>') }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
