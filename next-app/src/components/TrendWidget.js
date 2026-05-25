'use client';
import { motion } from 'framer-motion';
import styles from './TrendWidget.module.css';

export default function TrendWidget({ activeTeam }) {
  // Mock data for the trend
  const dataPoints = [
    { model: 'XGBoost', color: 'var(--blue-light)', pts: "0,80 20,75 40,60 60,40 80,30 100,20 120,25 140,15 160,10" },
    { model: 'LightGBM', color: 'var(--magenta)', pts: "0,70 20,65 40,65 60,45 80,35 100,30 120,20 140,25 160,15" },
    { model: 'Random Forest', color: 'var(--gold)', pts: "0,90 20,80 40,75 60,55 80,50 100,45 120,40 140,35 160,20" },
  ];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Model Agreement Trend</div>
        <div className={styles.sub}>{activeTeam} • ENSEMBLE CONVERGENCE</div>
      </div>
      
      <div className={styles.chartContainer}>
        <svg viewBox="0 0 160 100" className={styles.svgChart} preserveAspectRatio="none">
          {/* Grid lines */}
          {[20, 40, 60, 80].map(y => (
            <line key={y} x1="0" y1={y} x2="160" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          ))}
          
          {dataPoints.map((dp, i) => (
            <motion.polyline
              key={dp.model}
              points={dp.pts}
              fill="none"
              stroke={dp.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </div>
      
      <div className={styles.legend}>
        {dataPoints.map(dp => (
          <div key={dp.model} className={styles.legendItem}>
            <div className={styles.dot} style={{ background: dp.color, boxShadow: `0 0 10px ${dp.color}` }} />
            <span>{dp.model}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
