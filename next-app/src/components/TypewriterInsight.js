'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './TypewriterInsight.module.css';

// Mock insights based on the confederation/rank
const INSIGHTS = [
  "Analyzing historical data... Correlation detected between high midfield possession and overall win rate. Neural weights adjusted.",
  "Deep-Kick ensemble has identified a structural vulnerability in opponent transitions. Expected Goals (xG) multiplier activated.",
  "Simulating 10,000 matches... Tournament fatigue metrics indicate a 12% drop in performance post-group stage for this roster profile.",
  "Cross-referencing recent form data. High variance in attacking output detected. XGBoost model penalizes consistency score.",
  "Tactical alignment favors high-pressing systems. LightGBM predicts a 68% chance of scoring in the first 25 minutes."
];

export default function TypewriterInsight({ teamName }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    // Generate a pseudo-random index based on team name length so it's consistent per team
    const idx = teamName.length % INSIGHTS.length;
    setInsightIndex(idx);
    setDisplayedText('');
    setIsTyping(true);
  }, [teamName]);

  useEffect(() => {
    if (!isTyping) return;
    
    const targetText = INSIGHTS[insightIndex];
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < targetText.length) {
        setDisplayedText(prev => prev + targetText[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 40); // 40ms per character

    return () => clearInterval(typeInterval);
  }, [insightIndex, isTyping]);

  return (
    <motion.div 
      className={styles.widget}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.scanline} />
      
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.blinker} />
          DEEP-KICK LIVE INSIGHT
        </div>
        <div className={styles.timestamp}>
          {new Date().toISOString().split('T')[1].substring(0, 12)}Z
        </div>
      </div>

      <div className={styles.content}>
        {displayedText}
        {isTyping && <span className={styles.cursor} />}
      </div>
    </motion.div>
  );
}
