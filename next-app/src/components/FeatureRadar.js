'use client';
import { motion } from 'framer-motion';
import { TEAMS } from '@/data/dashboardData';
import styles from './FeatureRadar.module.css';

export default function FeatureRadar({ activeTeam, onTeamSelect }) {
  const features = ['XG', 'POSS', 'FORM', 'SQUAD VAL', 'DEF', 'PRESS', 'TRANS', 'SET PC'];
  
  const getPoints = (scaleArray) => {
    return features.map((f, i) => {
      const angle = (Math.PI * 2 * i) / features.length - Math.PI / 2;
      const r = 70 * scaleArray[i]; 
      return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
    }).join(' ');
  };

  const bgPoints = getPoints(Array(features.length).fill(1));
  const innerPoints1 = getPoints(Array(features.length).fill(0.66));
  const innerPoints2 = getPoints(Array(features.length).fill(0.33));
  
  // Dynamic pseudo-random data based on team string to show unique shapes per team
  const dataScale = features.map((_, i) => {
    const seed = activeTeam.length + i * 7;
    return 0.4 + ((seed * 13) % 55) / 100;
  });
  const dataPoints = getPoints(dataScale);

  const textPositions = features.map((f, i) => {
      const angle = (Math.PI * 2 * i) / features.length - Math.PI / 2;
      const r = 88; 
      return { x: 100 + r * Math.cos(angle), y: 100 + r * Math.sin(angle), text: f };
  });

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.title}>Feature Importance</div>
          <select 
            className={styles.teamSelect}
            value={activeTeam}
            onChange={(e) => onTeamSelect && onTeamSelect(e.target.value)}
          >
            {TEAMS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <div className={styles.sub}>{activeTeam} • NEURAL WEIGHTS</div>
      </div>
      
      <div className={styles.radarContainer}>
        <svg viewBox="0 0 200 200" className={styles.svgRadar}>
          {/* Background Polygon */}
          <polygon points={bgPoints} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          
          {/* Inner rings */}
          <polygon points={innerPoints1} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <polygon points={innerPoints2} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* Axes */}
          {textPositions.map((pos, i) => {
            const angle = (Math.PI * 2 * i) / features.length - Math.PI / 2;
            return (
              <line 
                key={`line-${i}`} 
                x1="100" 
                y1="100" 
                x2={100 + 70 * Math.cos(angle)} 
                y2={100 + 70 * Math.sin(angle)} 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="1" 
              />
            )
          })}

          {/* Data Polygon */}
          <motion.polygon
            points={dataPoints}
            fill="rgba(0, 225, 255, 0.2)"
            stroke="var(--blue-light)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,225,255,0.5))' }}
          />

          {/* Labels */}
          {textPositions.map((pos, i) => (
            <text 
              key={`text-${i}`} 
              x={pos.x} 
              y={pos.y} 
              fill="var(--text-mid)" 
              fontSize="8" 
              fontFamily="Inter" 
              fontWeight="700"
              textAnchor="middle" 
              dominantBaseline="middle"
            >
              {pos.text}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
