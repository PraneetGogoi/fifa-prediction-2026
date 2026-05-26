'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TEAMS, CONF_COLORS, getLineup } from '@/data/dashboardData';
import AnimatedNumber from '@/components/AnimatedNumber';
import styles from './TacticalPitch.module.css';

const medals = ['🥇', '🥈', '🥉'];
const positions = ['1st Favorite', '2nd Favorite', '3rd Favorite'];

function PitchSVG() {
  return (
    <svg viewBox="0 0 400 260" className={styles.pitchSvg} preserveAspectRatio="xMidYMid meet">
      {/* Pitch background */}
      <defs>
        <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0, 212, 255, 0.02)" />
          <stop offset="100%" stopColor="rgba(0, 212, 255, 0.08)" />
        </linearGradient>
        <pattern id="stripes" width="40" height="260" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="20" height="260" fill="rgba(0, 212, 255, 0.03)" />
          <rect x="20" y="0" width="20" height="260" fill="transparent" />
        </pattern>
      </defs>
      
      <rect width="400" height="260" fill="url(#pitchGrad)" rx="8" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="1" />
      <rect width="400" height="260" fill="url(#stripes)" rx="8" />

      {/* Pitch lines - Holographic style */}
      <g stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1.5" fill="none" filter="drop-shadow(0 0 2px rgba(0,212,255,0.5))">
        {/* Outer boundary */}
        <rect x="12" y="12" width="376" height="236" rx="4" />
        {/* Center line */}
        <line x1="200" y1="12" x2="200" y2="248" />
        {/* Center circle */}
        <circle cx="200" cy="130" r="36" />
        {/* Center spot */}
        <circle cx="200" cy="130" r="3" fill="rgba(0, 212, 255, 0.5)" stroke="none" />
        {/* Left penalty box */}
        <rect x="12" y="60" width="60" height="140" />
        {/* Right penalty box */}
        <rect x="328" y="60" width="60" height="140" />
        {/* Left goal box */}
        <rect x="12" y="94" width="24" height="72" />
        {/* Right goal box */}
        <rect x="364" y="94" width="24" height="72" />
        {/* Penalty spots */}
        <circle cx="48" cy="130" r="2" fill="rgba(0, 212, 255, 0.5)" stroke="none" />
        <circle cx="352" cy="130" r="2" fill="rgba(0, 212, 255, 0.5)" stroke="none" />
        {/* Penalty arcs */}
        <path d="M72,100 A32,32 0 0,1 72,160" />
        <path d="M328,100 A32,32 0 0,0 328,160" />
      </g>
    </svg>
  );
}

export default function TacticalPitch({ activeTeam = 'Generic', onTeamSelect = () => {}, isSyncing }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  const teamObj = TEAMS.find(t => t.name === activeTeam) || TEAMS[0];
  const teamRank = TEAMS.indexOf(teamObj) + 1;
  const lineup = getLineup(activeTeam);
  const confColor = CONF_COLORS[teamObj.conf];

  // Close player modal when team changes
  useEffect(() => {
    setSelectedPlayer(null);
  }, [activeTeam]);

  return (
    <div className={styles.wrapper}>
      {/* Top 3 Favorite Cards */}
      <div className={styles.topCards} id="topCards">
        {TEAMS.slice(0, 3).map((t, i) => (
          <motion.div
            key={t.name}
            className={`${styles.card} ${activeTeam === t.name ? styles.cardActive : ''}`}
            onClick={() => onTeamSelect(t.name)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.25, 1, 0.3, 1] }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <span className={styles.cardMedal}>{medals[i]}</span>
            <div className={styles.cardPos}>{positions[i]}</div>
            <div className={styles.cardName}>{t.name.toUpperCase()}</div>
            <div
              className={styles.cardConf}
              style={{ color: CONF_COLORS[t.conf] }}
            >
              {t.conf}
            </div>
            <div className={styles.cardProb}>{(t.prob * 100).toFixed(1)}%</div>
            <div className={styles.cardProbLabel}>WIN PROBABILITY</div>
            <div className={styles.cardBar}>
              <motion.div
                className={styles.cardBarFill}
                style={{ background: `linear-gradient(90deg, ${CONF_COLORS[t.conf]}44, ${CONF_COLORS[t.conf]})` }}
                initial={{ width: 0 }}
                animate={{ width: `${t.prob * 100}%` }}
                transition={{ delay: 0.6 + i * 0.1, duration: 1.2, ease: [0.25, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Tactical Pitch */}
      <div className={styles.pitch}>
        {/* Pitch header */}
        <div className={styles.pitchHeader}>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeTeam + '-badge'}
              className={styles.pitchBadge}
              style={{ color: confColor, borderColor: confColor + '55' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTeam.toUpperCase()} ({lineup.formation})
            </motion.span>
          </AnimatePresence>
          <div className={styles.pitchKpis}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTeam + '-prob'}
                className={styles.pitchKpi}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
              >
                <span id="tpKpiProb" className={styles.pitchKpiVal} style={{ color: confColor }}>
                  <AnimatedNumber value={teamObj.prob * 100} decimals={1} suffix="%" />
                </span>
                <span className={styles.pitchKpiLabel}>WIN PROB</span>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTeam + '-rank'}
                className={styles.pitchKpi}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <span id="tpKpiRank" className={styles.pitchKpiVal}>#{teamRank}</span>
                <span className={styles.pitchKpiLabel}>RANK</span>
              </motion.div>
            </AnimatePresence>
            <div className={styles.pitchKpi}>
              <span className={styles.pitchKpiVal}>{teamObj.form.toFixed(1)}</span>
              <span className={styles.pitchKpiLabel}>FORM</span>
            </div>
          </div>
        </div>

        {/* The pitch itself */}
        <div className={styles.pitchField} id="pitchField">
          {isSyncing && (
            <div className={styles.syncOverlay}>
              <div className={styles.syncScanline} />
              <div className={styles.syncText}>NEURAL SYNC...</div>
            </div>
          )}
          <PitchSVG />

          {/* Player nodes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam}
              className={styles.players}
              id="tpPlayers"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden:  {},
                visible: { transition: { staggerChildren: 0.04 } },
                exit:    {},
              }}
            >
              {lineup.players.map((p, idx) => (
                <motion.div
                  key={`${activeTeam}-${idx}`}
                  className={styles.player}
                  style={{ left: `${p.x}%`, top: `${p.y}%`, borderColor: confColor, boxShadow: `0 0 15px ${confColor}40` }}
                  title={`${p.name} (${p.pos})`}
                  variants={{
                    hidden:  { opacity: 0, scale: 0, rotate: -45 },
                    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 15 } },
                    exit:    { opacity: 0, scale: 0 },
                  }}
                  whileHover={{ scale: 1.2, zIndex: 50, boxShadow: `0 0 25px ${confColor}` }}
                  onClick={() => setSelectedPlayer(p)}
                >
                  <span className={styles.playerPos}>{p.pos}</span>
                  <span className={styles.playerName}>{p.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {selectedPlayer && (
              <motion.div 
                className={styles.playerModal}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
              >
                <button className={styles.modalClose} onClick={() => setSelectedPlayer(null)}>&times;</button>
                <div className={styles.modalHeader}>
                  <div className={styles.modalPos}>{selectedPlayer.pos}</div>
                  <div className={styles.modalName}>{selectedPlayer.name}</div>
                </div>
                <div className={styles.modalStats}>
                  <div className={styles.modalStat}>
                    <span>xG IMPACT</span>
                    <strong>+{(Math.random()*0.8 + 0.2).toFixed(2)}</strong>
                  </div>
                  <div className={styles.modalStat}>
                    <span>PASS ACCURACY</span>
                    <strong>{Math.floor(Math.random()*20 + 80)}%</strong>
                  </div>
                  <div className={styles.modalStat}>
                    <span>DEF ACTIONS</span>
                    <strong>{Math.floor(Math.random()*15 + 2)}</strong>
                  </div>
                </div>
                <div className={styles.modalBottom}>
                  NEURAL NETWORK WEIGHT: <span style={{color: 'var(--blue-light)'}}>{Math.floor(Math.random()*40 + 60)}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
