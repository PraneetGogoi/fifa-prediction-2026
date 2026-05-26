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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
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
