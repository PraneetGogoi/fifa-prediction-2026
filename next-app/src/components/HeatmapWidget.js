'use client';
import { motion } from 'framer-motion';
import styles from './HeatmapWidget.module.css';

export default function HeatmapWidget({ activeTeam }) {
  const rivals = ['FRA', 'BRA', 'ENG', 'ARG'];
  // Mock probabilities
  const grid = [
    [0.75, 0.42, 0.60, 0.48],
    [0.58, 0.80, 0.55, 0.45],
    [0.40, 0.45, 0.85, 0.65],
    [0.52, 0.55, 0.35, 0.90],
  ];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Matchup Heatmap</div>
        <div className={styles.sub}>{activeTeam} vs TOP RIVALS</div>
      </div>
      
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {grid.map((row, i) => (
            <div key={i} className={styles.row}>
              {row.map((val, j) => {
                // Compute color intensity based on value (higher val = more cyan)
                const isHigh = val > 0.6;
                const bg = `rgba(${isHigh ? '0, 225, 255' : '138, 43, 226'}, ${val - 0.2})`;
                const border = `1px solid rgba(${isHigh ? '0, 225, 255' : '138, 43, 226'}, ${val})`;
                const shadow = isHigh ? `0 0 10px rgba(0, 225, 255, ${val})` : 'none';

                return (
                  <motion.div 
                    key={j}
                    className={styles.cell}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (i * 4 + j) * 0.05 }}
                    style={{
                      background: bg,
                      border: border,
                      boxShadow: shadow
                    }}
                  >
                    {(val * 100).toFixed(0)}%
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
        <div className={styles.labelsBottom}>
          {rivals.map(r => <span key={r}>{r}</span>)}
        </div>
      </div>
    </div>
  );
}
