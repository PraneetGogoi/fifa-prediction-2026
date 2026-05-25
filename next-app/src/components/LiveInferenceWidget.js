'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './LiveInferenceWidget.module.css';

export default function LiveInferenceWidget({ activeTeam }) {
  const [dataStream, setDataStream] = useState([]);

  useEffect(() => {
    // Generate random hex streams to simulate neural network processing
    const interval = setInterval(() => {
      const newHex = Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0');
      const action = ['EVAL', 'CALC', 'NODE', 'SYNC'][Math.floor(Math.random()*4)];
      // Include a unique ID (timestamp) so Framer Motion can track new elements
      const id = Date.now() + Math.random();
      setDataStream(prev => [[action, newHex, id], ...prev].slice(0, 4));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className={styles.widget}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />
      
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.title}>Live Model<br/>Inference</div>
          <div className={styles.sub}>NEURAL NETWORKS ACTIVE</div>
        </div>
        <div className={styles.statusBlinker}>
          <div className={styles.dot} />
          <span>LIVE</span>
        </div>
      </div>

      <div className={styles.coreVisual}>
        <div className={styles.orbitalContainer}>
          <div className={styles.orbit1} />
          <div className={styles.orbit2} />
          <div className={styles.orbit3} />
          
          <div className={styles.coreCenter}>
            <div className={styles.coreValue}>94<span className={styles.corePct}>%</span></div>
            <div className={styles.coreLabel}>CONFIDENCE</div>
          </div>
        </div>
      </div>

      <div className={styles.dataStreamContainer}>
        <AnimatePresence>
          {dataStream.map((item, i) => (
            <motion.div 
              key={item[2]} // Unique ID for animation tracking
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1 - (i * 0.25), y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.streamRow}
            >
              <span className={styles.streamAction}>[{item[0]}]</span>
              <span className={styles.streamHex}>0x{item[1]}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>LATENCY</div>
          <div className={styles.metricVal}>14.2<span className={styles.metricUnit}>ms</span></div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>DATA POINTS</div>
          <div className={styles.metricVal}>2.4<span className={styles.metricUnit}>M+</span></div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>GPU ACCEL</div>
          <div className={styles.metricVal} style={{ color: '#00ff88' }}>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              ON
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
