'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './MatchSimulator.module.css';

const TEAMS = ['Spain', 'France', 'Brazil', 'England', 'Argentina', 'Germany', 'Portugal', 'Netherlands', 'Italy', 'Uruguay', 'Croatia'];

export default function MatchSimulator() {
  const [teamA, setTeamA] = useState('Spain');
  const [teamB, setTeamB] = useState('France');
  const [status, setStatus] = useState('IDLE'); // IDLE, SIMULATING, RESULT
  const [result, setResult] = useState(null);

  const handleSimulate = () => {
    setStatus('SIMULATING');
    // Simulate 2.5 seconds of calculation
    setTimeout(() => {
      // Very basic mock score logic
      const scoreA = Math.floor(Math.random() * 4);
      const scoreB = Math.floor(Math.random() * 3);
      setResult({ scoreA, scoreB });
      setStatus('RESULT');
    }, 2500);
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Neural Match Simulator</div>
        <div className={styles.sub}>H2H PREDICTION ENGINE</div>
      </div>
      
      <div className={styles.selectorContainer}>
        <select className={styles.selectBox} value={teamA} onChange={e => setTeamA(e.target.value)}>
          {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className={styles.vs}>VS</span>
        <select className={styles.selectBox} value={teamB} onChange={e => setTeamB(e.target.value)}>
          {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className={styles.actionContainer}>
        {status === 'IDLE' && (
          <button className={styles.simBtn} onClick={handleSimulate}>
            INITIALIZE SIMULATION
          </button>
        )}
        
        {status === 'SIMULATING' && (
          <div className={styles.simulating}>
            <div className={styles.progressLabel}>COMPUTING 10,000 SCENARIOS...</div>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: "linear" }}
              />
            </div>
          </div>
        )}

        {status === 'RESULT' && result && (
          <motion.div 
            className={styles.resultBox}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className={styles.scoreRow}>
              <div className={styles.teamScore}>{teamA.substring(0,3).toUpperCase()} <span className={styles.scoreNum}>{result.scoreA}</span></div>
              <div className={styles.scoreDash}>-</div>
              <div className={styles.teamScore}><span className={styles.scoreNum}>{result.scoreB}</span> {teamB.substring(0,3).toUpperCase()}</div>
            </div>
            <button className={styles.resetBtn} onClick={() => setStatus('IDLE')}>RUN ANOTHER</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
