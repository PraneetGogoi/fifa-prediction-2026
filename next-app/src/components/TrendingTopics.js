'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './TrendingTopics.module.css';

export default function TrendingTopics() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/trending');
        const data = await res.json();
        if (data.trending) {
          setTopics(data.trending);
        }
      } catch (err) {
        console.error('Failed to fetch trending topics', err);
      }
    };

    fetchTrending();
    const interval = setInterval(fetchTrending, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  // Calculate sizes based on values
  const maxVal = Math.max(...topics.map(t => t.value), 1);
  const minVal = Math.min(...topics.map(t => t.value), 1);

  const getFontSize = (val) => {
    const minSize = 0.8; // rem
    const maxSize = 2.5; // rem
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return minSize + ratio * (maxSize - minSize);
  };

  const getOpacity = (val) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return 0.4 + ratio * 0.6; // between 0.4 and 1
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>TRENDING TOPICS</div>
        <div className={styles.sub}>AI-GENERATED KEYWORD CLOUD</div>
      </div>
      
      <div className={styles.cloud}>
        {topics.map((topic, i) => (
          <motion.div
            key={topic.text}
            className={styles.tag}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: getOpacity(topic.value), 
              scale: 1,
              y: [0, Math.random() * -10, 0]
            }}
            transition={{ 
              opacity: { duration: 0.5, delay: i * 0.1 },
              scale: { duration: 0.5, delay: i * 0.1, type: 'spring' },
              y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{ fontSize: `${getFontSize(topic.value)}rem` }}
          >
            {topic.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
