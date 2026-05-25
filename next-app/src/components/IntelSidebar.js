'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { TEAMS, CONF_DATA, CONF_COLORS } from '@/data/dashboardData';
import styles from './IntelSidebar.module.css';

/* ─── Confederation Donut ─── */
function ConfDonut() {
  const R = 58;
  const circ = 2 * Math.PI * R;
  const total = CONF_DATA.reduce((s, c) => s + c.teams, 0);
  let cumOffset = 0;
  const segments = CONF_DATA.map(conf => {
    const pct = conf.teams / total;
    const dash = pct * circ;
    const gap = circ - dash;
    const offset = circ / 4 - cumOffset;
    cumOffset += dash;
    return { ...conf, dash, gap, offset };
  });

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donutTitle}>Confederation Share</div>
      <div className={styles.donutSvgWrap}>
        <svg className={styles.donutSvg} viewBox="0 0 160 160">
          <circle className={styles.donutBg} cx="80" cy="80" r={R} />
          {segments.map(seg => (
            <motion.circle
              key={seg.n}
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke={seg.col}
              strokeWidth="18"
              strokeLinecap="butt"
              strokeDasharray={`0 ${circ}`}
              strokeDashoffset={seg.offset}
              animate={{ strokeDasharray: `${seg.dash} ${seg.gap}` }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.3, 1] }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
            />
          ))}
        </svg>
        <div className={styles.donutCenter}>
          <span className={styles.dcNum}>47</span>
          <span className={styles.dcLabel}>UNIQUE<br />TEAMS</span>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend} id="confLegend">
        {CONF_DATA.map((c, i) => (
          <motion.div
            key={c.n}
            className={styles.legendItem}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <div className={styles.legendDot} style={{ background: c.col }} />
            <span className={styles.legendName}>{c.n}</span>
            <span className={styles.legendTeams}>{c.teams} teams</span>
            <span className={styles.legendProb}>{c.avgProb}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── KPI Tiles ─── */
function KPITiles() {
  const kpis = [
    { val: '0.675', label: 'Ensemble AUC' },
    { val: '63%',   label: 'Best Accuracy' },
    { val: '1,000', label: 'Train Rows' },
    { val: '5-Fold',label: 'Cross-Val' },
  ];
  return (
    <div className={styles.kpiGrid}>
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          className={styles.kpiTile}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 300 }}
        >
          <span className={styles.kpiNum}>{k.val}</span>
          <span className={styles.kpiLabel}>{k.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Radar Chart ─── */
const RADAR_DIMS = [
  { k: 'prob',   label: 'Win Prob',  max: 0.85 },
  { k: 'rating', label: 'Rating',    max: 90   },
  { k: 'wr',     label: 'Win Rate',  max: 0.80 },
  { k: 'form',   label: 'Form',      max: 9.5  },
  { k: 'pts',    label: 'FIFA Pts',  max: 1950 },
  { k: 'mv',     label: 'Market €M', max: 1000 },
];

function RadarChart({ activeTeam }) {
  const teamObj = TEAMS.find(t => t.name === activeTeam) || TEAMS[0];
  const col = CONF_COLORS[teamObj.conf];
  
  const W = 250;
  const H = 200;
  const cx = W / 2, cy = H / 2 - 4;
  const r = Math.min(cx, cy) - 24;
  const n = RADAR_DIMS.length;
  const angle = i => (Math.PI * 2 * i / n) - Math.PI / 2;

  // Background rings
  const rings = [0.25, 0.5, 0.75, 1].map(frac => {
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
    return { x: cx + (r + 16) * Math.cos(a), y: cy + (r + 16) * Math.sin(a) + 3, label: d.label };
  });

  const vals = RADAR_DIMS.map(d => Math.min(teamObj[d.k] / d.max, 1));
  const polyPts = vals.map((v, i) => {
    const a = angle(i);
    return `${cx + r * v * Math.cos(a)},${cy + r * v * Math.sin(a)}`;
  }).join(' ');

  const dataPoints = vals.map((v, i) => {
    const a = angle(i);
    return { cx: cx + r * v * Math.cos(a), cy: cy + r * v * Math.sin(a) };
  });

  return (
    <div className={styles.radarSection}>
      <div className={styles.radarTitle}>Team Profile Radar</div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.svg
            key={activeTeam}
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', maxWidth: '250px', overflow: 'visible' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35 }}
          >
            {rings.map((pts, i) => (
              <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            
            {axes.map((ax, i) => (
              <line key={i} x1={cx} y1={cy} x2={ax.x2} y2={ax.y2} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}

            {labels.map((lb, i) => (
              <text key={i} x={lb.x} y={lb.y} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8.5" fontFamily="Inter" fontWeight="700">
                {lb.label}
              </text>
            ))}

            <polygon points={polyPts} fill={col} fillOpacity="0.15" stroke={col} strokeWidth="1.8" strokeLinejoin="round" />
            
            {dataPoints.map((dp, i) => (
              <circle key={i} cx={dp.cx} cy={dp.cy} r="3.5" fill={col} stroke="#090f0c" strokeWidth="1" />
            ))}

            <text x={cx} y={cy + 4} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="10" fontWeight="800" fontFamily="Outfit">
              {teamObj.name.toUpperCase()}
            </text>
          </motion.svg>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function IntelSidebar({ activeTeam }) {
  return (
    <aside className={styles.sidebar}>
      <ConfDonut />
      <KPITiles />
      <RadarChart activeTeam={activeTeam} />
    </aside>
  );
}
