'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './BootLoader.module.css';

export default function BootLoader() {
  const [progress, setProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Removed sessionStorage check so it plays on every hard refresh for testing
    setIsBooting(true);
  }, []);

  useEffect(() => {
    if (!isBooting) return;

    let startTime = Date.now();
    const duration = 2000; // 2 seconds total loading time

    const loadInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        clearInterval(loadInterval);
        setTimeout(() => {
          setIsBooting(false);
        }, 400); // Small pause at 100% before fading out
      }
    }, 20);

    return () => clearInterval(loadInterval);
  }, [isBooting]);

  if (!hasMounted) return null;

  return (
    <AnimatePresence>
      {isBooting && (
        <motion.div 
          className={styles.bootScreen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className={styles.logoContainer}>
            <div className={styles.glow} />
            <motion.svg 
              width="100" 
              height="100" 
              viewBox="0 0 100 100" 
              style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}
            >
              <motion.circle 
                cx="50" cy="50" r="45" 
                stroke="var(--blue-light)" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="40 20"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle 
                cx="50" cy="50" r="30" 
                stroke="var(--magenta)" 
                strokeWidth="4" 
                fill="none" 
                strokeDasharray="20 40"
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle 
                cx="50" cy="50" r="12" 
                fill="var(--gold)" 
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>
          </div>

          <motion.div 
            className={styles.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            DEEP-KICK
          </motion.div>
          
          <motion.div 
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.dot} />
            NEURAL ENGINE INITIALIZING
          </motion.div>

          <div className={styles.loadingBarContainer}>
            <motion.div 
              className={styles.loadingFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
