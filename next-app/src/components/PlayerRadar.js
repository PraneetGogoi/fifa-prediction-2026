'use client';
import { motion } from 'framer-motion';
import styles from './PlayerRadar.module.css';

export default function PlayerRadar({ player }) {
  if (!player) return null;

  // Stats in order: Pace, Shooting, Passing, Dribbling, Defending, Physical
  const stats = [player.pac, player.sho, player.pas, player.dri, player.def, player.phy];
  const labels = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'];
  
  const size = 160;
  const center = size / 2;
  const radius = size / 2;
  const angleStep = (Math.PI * 2) / stats.length;

  const getPoint = (value, index) => {
    const r = (value / 100) * radius;
    // Rotate by -90 degrees (Math.PI/2) so the first point is at the top
    const theta = index * angleStep - Math.PI / 2;
    return {
      x: center + r * Math.cos(theta),
      y: center + r * Math.sin(theta)
    };
  };

  const points = stats.map((val, i) => getPoint(val, i));
  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ') + ' Z';

  // Generate background webs
  const webs = [0.2, 0.4, 0.6, 0.8, 1.0].map(level => {
    const pts = stats.map((_, i) => getPoint(100 * level, i));
    return pts.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ') + ' Z';
  });

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.scanline} />
      
      <div className={styles.header}>
        <div className={styles.playerName}>{player.name}</div>
        <div className={styles.playerPos}>{player.pos}</div>
      </div>

      <div className={styles.radarWrapper}>
        <svg width={size + 40} height={size + 40} viewBox={`-20 -20 ${size + 40} ${size + 40}`}>
          {/* Background Webs */}
          {webs.map((web, i) => (
            <path key={i} d={web} stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
          ))}
          {/* Axes */}
          {stats.map((_, i) => {
            const p = getPoint(100, i);
            return (
              <line 
                key={`axis-${i}`} 
                x1={center} y1={center} 
                x2={p.x} y2={p.y} 
                stroke="rgba(255,255,255,0.1)" strokeWidth="1" 
              />
            );
          })}
          {/* Data Path */}
          <motion.path 
            d={pathData} 
            fill="rgba(0, 255, 136, 0.3)" 
            stroke="#00ff88" 
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* Data Points */}
          {points.map((p, i) => (
            <circle key={`pt-${i}`} cx={p.x} cy={p.y} r="3" fill="#ffffff" />
          ))}
        </svg>

        {/* Labels */}
        {labels.map((label, i) => {
          const p = getPoint(120, i);
          return (
            <div 
              key={label}
              className={styles.radarLabel}
              style={{
                left: p.x + 20,
                top: p.y + 20,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
