'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAMS, CONF_COLORS } from '@/data/dashboardData';
import styles from './HeadToHead.module.css';

const RADAR_DIMS = [
  { k: 'prob',   label: 'WIN PROB',  max: 0.85 },
  { k: 'rating', label: 'RATING',    max: 90   },
  { k: 'wr',     label: 'WIN RATE',  max: 0.80 },
  { k: 'form',   label: 'FORM',      max: 9.5  },
  { k: 'pts',    label: 'FIFA PTS',  max: 1950 },
  { k: 'mv',     label: 'MARKET €M', max: 1000 },
];

export default function HeadToHead({ activeTeam }) {
  const [teamA, setTeamA] = useState(activeTeam || 'Spain');
  // Auto-select a rival for Team B
  const [teamB, setTeamB] = useState(() => {
    const rivals = ['France', 'Brazil', 'England', 'Argentina'];
    const b = rivals.find(r => r !== activeTeam);
    return b || 'France';
  });

  const objA = TEAMS.find(t => t.name === teamA) || TEAMS[0];
  const objB = TEAMS.find(t => t.name === teamB) || TEAMS[1];

  const colA = CONF_COLORS[objA.conf] || 'var(--blue-light)';
  const colB = CONF_COLORS[objB.conf] || 'var(--magenta)';

  // --- Generate Radar SVGs ---
  const W = 400;
  const H = 400;
  const cx = W / 2, cy = H / 2;
  const r = Math.min(cx, cy) - 40;
  const n = RADAR_DIMS.length;
  const angle = i => (Math.PI * 2 * i / n) - Math.PI / 2;

  const rings = [0.33, 0.66, 1].map(frac => {
    return RADAR_DIMS.map((_, i) => {
      const a = angle(i);
      return `${cx + r * frac * Math.cos(a)},${cy + r * frac * Math.sin(a)}`;
    }).join(' ');
  });

  const axes = RADAR_DIMS.map((_, i) => {
    const a = angle(i);
    return { x2: cx + r * Math.cos(a), y2: cy + r * Math.sin(a) };
  });

  const labels = RADAR_DIMS.map((d, i) => {
    const a = angle(i);
    return { 
      x: cx + (r + 25) * Math.cos(a), 
      y: cy + (r + 25) * Math.sin(a) + 4, 
      label: d.label 
    };
  });

  // Poly points for A
  const valsA = RADAR_DIMS.map(d => Math.min(objA[d.k] / d.max, 1));
  const polyA = valsA.map((v, i) => {
    const a = angle(i);
    return `${cx + r * v * Math.cos(a)},${cy + r * v * Math.sin(a)}`;
  }).join(' ');

  // Poly points for B
  const valsB = RADAR_DIMS.map(d => Math.min(objB[d.k] / d.max, 1));
  const polyB = valsB.map((v, i) => {
    const a = angle(i);
    return `${cx + r * v * Math.cos(a)},${cy + r * v * Math.sin(a)}`;
  }).join(' ');

  // Stat comparison logic
  const stats = [
    { label: 'Win Probability', valA: `${(objA.prob * 100).toFixed(1)}%`, valB: `${(objB.prob * 100).toFixed(1)}%`, isAwinner: objA.prob > objB.prob },
    { label: 'Neural Rating', valA: objA.rating.toFixed(1), valB: objB.rating.toFixed(1), isAwinner: objA.rating > objB.rating },
    { label: 'Market Value', valA: `€${objA.mv}M`, valB: `€${objB.mv}M`, isAwinner: objA.mv > objB.mv },
    { label: 'Recent Form', valA: objA.form.toFixed(2), valB: objB.form.toFixed(2), isAwinner: objA.form > objB.form },
  ];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Head-to-Head Analysis</div>
        <div className={styles.sub}>DUAL-MATRIX COMPARISON</div>
      </div>

      <div className={styles.content}>
        {/* TEAM A */}
        <div className={styles.teamCol}>
          <select 
            className={styles.teamSelect} 
            value={teamA} 
            onChange={(e) => setTeamA(e.target.value)}
            style={{ color: colA, borderColor: colA }}
          >
            {TEAMS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
          <div className={styles.statsList}>
            {stats.map((s, i) => (
              <motion.div key={i} className={styles.statRow} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.1 }}>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={`${styles.statValue} ${s.isAwinner ? styles.winner : ''}`}>{s.valA}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RADAR OVERLAY */}
        <div className={styles.radarCol}>
          <div className={styles.radarWrapper}>
            <AnimatePresence mode="popLayout">
              <motion.svg 
                key={`${teamA}-${teamB}`}
                className={styles.radarSvg} 
                viewBox={`0 0 ${W} ${H}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                {/* BG Rings & Axes */}
                {rings.map((pts, i) => (
                  <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                {axes.map((ax, i) => (
                  <line key={i} x1={cx} y1={cy} x2={ax.x2} y2={ax.y2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                {labels.map((lb, i) => (
                  <text key={i} x={lb.x} y={lb.y} textAnchor="middle" fill="var(--text-mid)" fontSize="10" fontFamily="Inter" fontWeight="800">
                    {lb.label}
                  </text>
                ))}

                {/* Polygon B */}
                <polygon points={polyB} fill={colB} fillOpacity="0.2" stroke={colB} strokeWidth="2" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${colB})` }} />
                
                {/* Polygon A */}
                <polygon points={polyA} fill={colA} fillOpacity="0.2" stroke={colA} strokeWidth="2" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${colA})` }} />
              </motion.svg>
            </AnimatePresence>
          </div>
        </div>

        {/* TEAM B */}
        <div className={styles.teamCol}>
          <select 
            className={styles.teamSelect} 
            value={teamB} 
            onChange={(e) => setTeamB(e.target.value)}
            style={{ color: colB, borderColor: colB }}
          >
            {TEAMS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
          <div className={styles.statsList}>
            {stats.map((s, i) => (
              <motion.div key={i} className={styles.statRow} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.1 }}>
                <span className={`${styles.statValue} ${!s.isAwinner && s.valA !== s.valB ? styles.winner : ''}`}>{s.valB}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
