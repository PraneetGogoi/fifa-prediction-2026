'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TEAMS } from '@/data/dashboardData';
import styles from './CommandPalette.module.css';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
    }
  }, [isOpen]);

  const filteredTeams = query 
    ? TEAMS.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.conf.toLowerCase().includes(query.toLowerCase()))
    : TEAMS.slice(0, 5); // Show top 5 favorites by default

  const handleSelect = (teamName) => {
    setIsOpen(false);
    router.push(`/teams/${teamName.toLowerCase()}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div 
            className={styles.modal}
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            <input 
              ref={inputRef}
              className={styles.searchInput}
              placeholder="Search for a team or confederation..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            
            <div className={styles.results}>
              {filteredTeams.length > 0 ? (
                filteredTeams.map(team => (
                  <div 
                    key={team.name} 
                    className={styles.resultItem}
                    onClick={() => handleSelect(team.name)}
                  >
                    <div>
                      <div className={styles.teamName}>{team.name}</div>
                      <div className={styles.teamConf}>{team.conf}</div>
                    </div>
                    <div className={styles.teamProb}>
                      {(team.prob * 100).toFixed(1)}%
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                  No neural matches found.
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <span><span className={styles.kbd}>esc</span> to close</span>
              <span><span className={styles.kbd}>enter</span> to select</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
