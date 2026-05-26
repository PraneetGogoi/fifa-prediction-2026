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
              <svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
                <motion.circle 
                  cx="20" cy="20" r="16" 
                  stroke="url(#paint0_linear)" 
                  strokeWidth="3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  strokeDasharray="25 15"
                />
                <motion.path 
                  d="M20 4 C12 12 12 28 20 36 C28 28 28 12 20 4 Z" 
                  stroke="url(#paint1_linear)" 
                  strokeWidth="2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path 
                  d="M4 20 C12 12 28 12 36 20 C28 28 12 28 4 20 Z" 
                  stroke="url(#paint2_linear)" 
                  strokeWidth="2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <defs>
                  <linearGradient id="paint0_linear" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff007f"/>
                    <stop offset="1" stopColor="#00e1ff"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC900"/>
                    <stop offset="1" stopColor="#ff007f"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear" x1="4" y1="20" x2="36" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00ff88"/>
                    <stop offset="1" stopColor="#00e1ff"/>
                  </linearGradient>
                </defs>
              </svg>
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
