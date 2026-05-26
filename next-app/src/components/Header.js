'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';
import AuthModal from './AuthModal';
import styles from './Header.module.css';

export default function Header() {
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <div className={styles.headerWrapper}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left branding */}
          <div className={styles.brand}>
            <motion.div
              className={styles.brandBall}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="16" stroke="url(#paint0_linear)" strokeWidth="3"/>
                <path d="M20 4 C12 12 12 28 20 36 C28 28 28 12 20 4 Z" stroke="url(#paint1_linear)" strokeWidth="2"/>
                <path d="M4 20 C12 12 28 12 36 20 C28 28 12 28 4 20 Z" stroke="url(#paint2_linear)" strokeWidth="2"/>
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
            </motion.div>
            <div>
              <div className={styles.brandTitle}>NEURAL WC26</div>
              <div className={styles.brandSub}>PREDICTION INTELLIGENCE</div>
            </div>
          </div>

          {/* Center score badges */}
          <div className={styles.center}>
            <motion.div
              className={styles.scoreBadge}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            >
              <span className={styles.scoreNum}>0.675</span>
              <span className={styles.scoreLabel}>ENSEMBLE AUC</span>
            </motion.div>
            <motion.div
              className={`${styles.scoreBadge} ${styles.scoreBadgeGold}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 300 }}
            >
              <span className={styles.scoreNum}>63%</span>
              <span className={styles.scoreLabel}>BEST ACCURACY</span>
            </motion.div>
            <motion.div
              className={styles.scoreBadge}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
            >
              <span className={styles.scoreNum}>47</span>
              <span className={styles.scoreLabel}>TEAMS RANKED</span>
            </motion.div>
          </div>

          {/* Right status */}
          <div className={styles.right}>
            {user ? (
              <div className={styles.userSection}>
                <span className={styles.userEmail}>{user.email.split('@')[0]}</span>
                <button onClick={handleLogout} className={styles.authBtn}>LOGOUT</button>
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className={styles.authBtn}>LOGIN</button>
            )}
          </div>
        </motion.header>
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
