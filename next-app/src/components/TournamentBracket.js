'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TEAMS } from '@/data/dashboardData';
import styles from './TournamentBracket.module.css';

// Initial 8 matchups (16 teams)
const INIT_R16 = [
  ['Spain', 'Morocco'],
  ['Brazil', 'Uruguay'],
  ['France', 'Denmark'],
  ['Argentina', 'Mexico'],
  ['England', 'Senegal'],
  ['Germany', 'Japan'],
  ['Portugal', 'USA'],
  ['Netherlands', 'Ecuador']
];

export default function TournamentBracket() {
  // State for each round. null means TBD.
  const [r16] = useState(INIT_R16);
  const [qf, setQf] = useState([
    [null, null], [null, null],
    [null, null], [null, null]
  ]);
  const [sf, setSf] = useState([
    [null, null], [null, null]
  ]);
  const [final, setFinal] = useState([null, null]);
  const [champion, setChampion] = useState(null);

  // Helper to get probability of team A beating team B using our dashboard data
  const getProb = (teamA, teamB) => {
    if (!teamA || !teamB) return null;
    const a = TEAMS.find(t => t.name === teamA);
    const b = TEAMS.find(t => t.name === teamB);
    if (!a || !b) return '50%';
    
    // Simple mock logic based on raw probs
    const total = a.prob + b.prob;
    const probA = (a.prob / total) * 100;
    return `${probA.toFixed(0)}%`;
  };

  // Logic to advance a team
  const advanceTeam = (teamName, fromRound, matchIndex) => {
    if (!teamName) return;

    if (fromRound === 'r16') {
      const newQf = [...qf];
      const slot = Math.floor(matchIndex / 2);
      const pos = matchIndex % 2;
      newQf[slot][pos] = teamName;
      setQf(newQf);
      // Reset downstream
      const newSf = [...sf]; newSf[Math.floor(slot/2)][slot%2] = null; setSf(newSf);
      setFinal([null, null]); setChampion(null);
    } 
    else if (fromRound === 'qf') {
      const newSf = [...sf];
      const slot = Math.floor(matchIndex / 2);
      const pos = matchIndex % 2;
      newSf[slot][pos] = teamName;
      setSf(newSf);
      // Reset downstream
      setFinal([null, null]); setChampion(null);
    }
    else if (fromRound === 'sf') {
      const newFinal = [...final];
      newFinal[matchIndex] = teamName;
      setFinal(newFinal);
      setChampion(null);
    }
    else if (fromRound === 'final') {
      setChampion(teamName);
    }
  };

  const renderMatch = (match, round, matchIndex, nextRoundMatches) => {
    const [teamA, teamB] = match;
    const probA = getProb(teamA, teamB);
    const probB = getProb(teamB, teamA);

    // Determine if team advanced
    let advancedA = false;
    let advancedB = false;

    if (round === 'r16') {
      advancedA = qf.flat().includes(teamA);
      advancedB = qf.flat().includes(teamB);
    } else if (round === 'qf') {
      advancedA = sf.flat().includes(teamA);
      advancedB = sf.flat().includes(teamB);
    } else if (round === 'sf') {
      advancedA = final.includes(teamA);
      advancedB = final.includes(teamB);
    } else if (round === 'final') {
      advancedA = champion === teamA;
      advancedB = champion === teamB;
    }

    return (
      <div className={styles.match} key={`${round}-${matchIndex}`}>
        <div 
          className={`${styles.team} ${teamA ? styles.active : ''} ${advancedA ? styles.winner : ''}`}
          onClick={() => advanceTeam(teamA, round, matchIndex)}
        >
          <span>{teamA ? teamA.substring(0,3).toUpperCase() : 'TBD'}</span>
          {teamA && teamB && <span className={styles.prob}>{probA}</span>}
        </div>
        <div 
          className={`${styles.team} ${teamB ? styles.active : ''} ${advancedB ? styles.winner : ''}`}
          onClick={() => advanceTeam(teamB, round, matchIndex)}
        >
          <span>{teamB ? teamB.substring(0,3).toUpperCase() : 'TBD'}</span>
          {teamA && teamB && <span className={styles.prob}>{probB}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Interactive Bracket</div>
        <div className={styles.sub}>CLICK TO ADVANCE TEAMS TO THE FINAL</div>
      </div>
      
      <div className={styles.bracketWrapper}>
        {/* Left Side (R16, QF, SF) */}
        <div className={`${styles.column} ${styles.colLeft}`}>
          {r16.slice(0, 4).map((m, i) => renderMatch(m, 'r16', i))}
        </div>
        <div className={`${styles.column} ${styles.colLeft}`}>
          {qf.slice(0, 2).map((m, i) => renderMatch(m, 'qf', i))}
        </div>
        <div className={`${styles.column} ${styles.colLeft}`}>
          {renderMatch(sf[0], 'sf', 0)}
        </div>

        {/* Center (Final & Champion) */}
        <div className={`${styles.column} ${styles.colCenter}`}>
          <div className={styles.trophy}>🏆</div>
          <div className={styles.championName}>
            {champion ? champion : '???'}
          </div>
          <div style={{ marginTop: '48px' }}>
            {renderMatch(final, 'final', 0)}
          </div>
        </div>

        {/* Right Side (SF, QF, R16) */}
        <div className={`${styles.column} ${styles.colRight}`}>
          {renderMatch(sf[1], 'sf', 1)}
        </div>
        <div className={`${styles.column} ${styles.colRight}`}>
          {qf.slice(2, 4).map((m, i) => renderMatch(m, 'qf', i+2))}
        </div>
        <div className={`${styles.column} ${styles.colRight}`}>
          {r16.slice(4, 8).map((m, i) => renderMatch(m, 'r16', i+4))}
        </div>
      </div>
    </div>
  );
}
