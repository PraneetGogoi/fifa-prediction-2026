'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { TEAMS, MODELS, CV_DATA, HIST, HIST_LABELS, FEATURES, CONF_COLORS } from '@/data/dashboardData';
import styles from './ChartsPanel.module.css';

/* ─── Probability Spectrum ─── */
function ProbSpectrum({ onTeamSelect, activeTeam }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const specColors = [
    'linear-gradient(90deg,#8a6e1a,#F5C842)',
    'linear-gradient(90deg,#6a8e1a,#aaF542)',
    'linear-gradient(90deg,#1a7a5a,#3effc4)',
    'linear-gradient(90deg,#1a5a8a,#5ec4ff)',
    'linear-gradient(90deg,#5a1a8a,#b57fe0)',
    'linear-gradient(90deg,#1a5c2a,#4effa0)',
    'linear-gradient(90deg,#3a3a8a,#7a7fe0)',
    'linear-gradient(90deg,#8a3a1a,#ffa07a)',
    'linear-gradient(90deg,#6a1a6a,#d97fe0)',
    'linear-gradient(90deg,#1a6a3a,#5effc4)',
    'linear-gradient(90deg,#1a4a8a,#4eaaff)',
    'linear-gradient(90deg,#5a5a1a,#cccc4e)',
  ];

  return (
    <div className={styles.chartCard} ref={ref}>
      <div className={styles.chartHead}>
        <span className={styles.chartTitle}>Win Probability Spectrum</span>
        <span className={styles.chartSub}>Top 12 Contenders</span>
      </div>
      <div className={styles.chartBody}>
        {TEAMS.slice(0, 12).map((t, i) => (
          <motion.div
            key={t.name}
            className={`${styles.psRow} ${activeTeam === t.name ? styles.psRowActive : ''}`}
            onClick={() => onTeamSelect(t.name)}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            whileHover={{ x: 4 }}
          >
            <div className={styles.psLabel}>
              <span className={styles.psTag} style={{ color: CONF_COLORS[t.conf], borderColor: CONF_COLORS[t.conf] }}>
                {t.conf.substring(0, 3)}
              </span>
              <span className={styles.psName}>{t.name}</span>
            </div>
            <div className={styles.psTrack}>
              <motion.div
                className={styles.psFill}
                style={{ background: specColors[i] }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${t.prob * 100}%` } : {}}
                transition={{ delay: i * 0.05 + 0.3, duration: 1, ease: [0.25, 1, 0.3, 1] }}
              />
            </div>
            <span className={styles.psVal}>{(t.prob * 100).toFixed(1)}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Model Comparer ─── */
function ModelComparer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div className={styles.chartCard} ref={ref}>
      <div className={styles.chartHead}>
        <span className={styles.chartTitle}>Model Performance</span>
        <span className={styles.chartSub}>AUC Comparison</span>
      </div>
      <div className={styles.chartBody}>
        {MODELS.map((m, i) => (
          <motion.div
            key={m.n}
            className={styles.mcRow}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: i * 0.1 }}
          >
            <span className={styles.mcName}>{m.n}</span>
            <div className={styles.mcTrack}>
              <motion.div
                className={styles.mcFill}
                style={{ background: m.col }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${m.w}%` } : {}}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.9, ease: [0.25, 1, 0.3, 1] }}
              />
            </div>
            <span className={styles.mcAuc} style={{ color: m.col }}>{m.auc}</span>
            <span className={styles.mcAcc}>{(m.acc * 100).toFixed(0)}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Histogram ─── */
function Histogram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const histMax = Math.max(...HIST);

  return (
    <div className={styles.chartCard} ref={ref}>
      <div className={styles.chartHead}>
        <span className={styles.chartTitle}>Win Probability Distribution</span>
        <span className={styles.chartSub}>Teams by Probability Bucket</span>
      </div>
      <div className={styles.chartBodyHist}>
        {HIST.map((count, i) => {
          const h = Math.round((count / histMax) * 100);
          const col = `hsl(${140 + i * 5}, ${55 + i * 2}%, ${40 + i * 2}%)`;
          return (
            <div key={i} className={styles.histWrap} title={`${HIST_LABELS[i]}: ${count} teams`}>
              <span className={styles.histCount}>{count}</span>
              <motion.div
                className={styles.histBar}
                style={{ background: `linear-gradient(180deg,${col},rgba(57,255,154,0.15))` }}
                initial={{ height: 0 }}
                animate={inView ? { height: `${h}px` } : {}}
                transition={{ delay: i * 0.06, duration: 0.7, ease: [0.25, 1, 0.3, 1] }}
              />
              <span className={styles.histLabel}>{HIST_LABELS[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Feature Importance ─── */
function FeatureImportance() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const featGrad = [
    'linear-gradient(90deg,#8a6e1a,#F5C842)',
    'linear-gradient(90deg,#6a8e1a,#aaF542)',
    'linear-gradient(90deg,#1a7a5a,#3effc4)',
    'linear-gradient(90deg,#1a5a8a,#5ec4ff)',
    'linear-gradient(90deg,#5a1a8a,#b57fe0)',
    'linear-gradient(90deg,#6a4a1a,#ffaa3a)',
    'linear-gradient(90deg,#1a6a5a,#4eeec4)',
    'linear-gradient(90deg,#4a1a6a,#c07fe0)',
    'linear-gradient(90deg,#6a1a6a,#d97fe0)',
    'linear-gradient(90deg,#1a4a6a,#4eaaff)',
  ];

  return (
    <div className={styles.chartCard} ref={ref}>
      <div className={styles.chartHead}>
        <span className={styles.chartTitle}>Feature Importance</span>
        <span className={styles.chartSub}>Top 10 Predictor Values</span>
      </div>
      <div className={styles.chartBody} id="featList">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.n}
            className={styles.featRow}
            initial={{ opacity: 0, x: 12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.05 }}
          >
            <span className={styles.featNum}>{i + 1}</span>
            <span className={styles.featName}>{f.n}</span>
            <div className={styles.featTrack}>
              <motion.div
                className={styles.featFill}
                style={{ background: featGrad[i] }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${f.pct}%` } : {}}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.9, ease: [0.25, 1, 0.3, 1] }}
              />
            </div>
            <span className={styles.featPct}>{f.pct}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── CV Line Chart (SVG) ─── */
function CVLineChart() {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: true });

  useEffect(() => {
    if (!inView || !svgRef.current) return;
    const svg = svgRef.current;
    const W = wrapRef.current.offsetWidth || 500;
    const H = 160;
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);

    const pad = { t: 16, b: 32, l: 36, r: 16 };
    const chartW = W - pad.l - pad.r;
    const chartH = H - pad.t - pad.b;
    const folds = [1, 2, 3, 4, 5];
    const allVals = Object.values(CV_DATA).flat();
    const vMin = Math.min(...allVals) - 0.01;
    const vMax = Math.max(...allVals) + 0.01;
    const xPos = i => pad.l + (i / (folds.length - 1)) * chartW;
    const yPos = v => pad.t + (1 - (v - vMin) / (vMax - vMin)) * chartH;

    [0.62, 0.65, 0.68, 0.71, 0.74, 0.77].forEach(v => {
      if (v < vMin || v > vMax) return;
      const y = yPos(v);
      svg.innerHTML += `<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        <text x="${pad.l - 4}" y="${y + 3}" text-anchor="end" fill="rgba(255,255,255,0.4)" font-size="9" font-family="Montserrat">${v.toFixed(2)}</text>`;
    });
    folds.forEach((f, i) => {
      svg.innerHTML += `<text x="${xPos(i)}" y="${H - 4}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9" font-family="Montserrat">Fold ${f}</text>`;
    });

    const series = [
      { key: 'XGBoost', col: '#FFC900' },
      { key: 'LightGBM', col: '#00e1ff' },
      { key: 'RF', col: '#00ff88' },
    ];

    series.forEach(({ key, col }) => {
      const vals = CV_DATA[key];
      const pts = vals.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ');
      const areaPath =
        `M${xPos(0)},${yPos(vals[0])} ` +
        vals.map((v, i) => `L${xPos(i)},${yPos(v)}`).join(' ') +
        ` L${xPos(vals.length - 1)},${pad.t + chartH} L${xPos(0)},${pad.t + chartH} Z`;
      svg.innerHTML += `<path d="${areaPath}" fill="${col}" opacity="0.06"/>`;
      svg.innerHTML += `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8 3"/>`;
      vals.forEach((v, i) => {
        svg.innerHTML += `<circle cx="${xPos(i)}" cy="${yPos(v)}" r="4.5" fill="${col}" stroke="#050806" stroke-width="1.5" style="cursor:pointer"/>`;
      });
    });
  }, [inView]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHead}>
        <span className={styles.chartTitle}>Cross-Validation Performance</span>
        <span className={styles.chartSub}>5-Fold AUC by Model</span>
      </div>
      <div ref={wrapRef} className={styles.chartBody}>
        <svg ref={svgRef} style={{ width: '100%', overflow: 'visible' }} />
        <div className={styles.legend}>
          {[{ n: 'XGBoost', col: '#FFC900' }, { n: 'LightGBM', col: '#00e1ff' }, { n: 'Random Forest', col: '#00ff88' }].map(l => (
            <div key={l.n} className={styles.legendItem}>
              <svg width="24" height="4"><line x1="0" y1="2" x2="24" y2="2" stroke={l.col} strokeWidth="2" strokeDasharray="4 2" /></svg>
              <span style={{ color: 'var(--text-mid)', fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.75rem' }}>{l.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Scatter Plot (SVG) ─── */
function ScatterPlot() {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: true });

  useEffect(() => {
    if (!inView || !svgRef.current) return;
    const svg = svgRef.current;
    const W = wrapRef.current.offsetWidth || 380;
    const H = 220;
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);

    const pad = { t: 12, b: 28, l: 32, r: 12 };
    const chartW = W - pad.l - pad.r;
    const chartH = H - pad.t - pad.b;

    const ptsAll = TEAMS.map(t => t.pts);
    const probAll = TEAMS.map(t => t.prob);
    const mvAll = TEAMS.map(t => t.mv);
    const ptMin = Math.min(...ptsAll) - 30, ptMax = Math.max(...ptsAll) + 30;
    const prMin = Math.min(...probAll) - 0.02, prMax = Math.max(...probAll) + 0.02;
    const xPos = p => pad.l + (p - ptMin) / (ptMax - ptMin) * chartW;
    const yPos = p => pad.t + (1 - (p - prMin) / (prMax - prMin)) * chartH;

    [1600, 1700, 1800, 1900].forEach(v => {
      const x = xPos(v);
      svg.innerHTML += `<line x1="${x}" y1="${pad.t}" x2="${x}" y2="${H - pad.b}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        <text x="${x}" y="${H - 4}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8" font-family="Montserrat" font-weight="800">${v}</text>`;
    });
    [0.55, 0.65, 0.75].forEach(v => {
      const y = yPos(v);
      svg.innerHTML += `<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        <text x="${pad.l - 3}" y="${y + 3}" text-anchor="end" fill="rgba(255,255,255,0.4)" font-size="8" font-family="Montserrat" font-weight="800">${(v * 100).toFixed(0)}%</text>`;
    });

    const n = TEAMS.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    TEAMS.forEach(t => { sumX += t.pts; sumY += t.prob; sumXY += t.pts * t.prob; sumX2 += t.pts * t.pts; });
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const tX1 = ptMin + 30, tX2 = ptMax - 30;
    svg.innerHTML += `<line x1="${xPos(tX1)}" y1="${yPos(slope * tX1 + intercept)}" x2="${xPos(tX2)}" y2="${yPos(slope * tX2 + intercept)}" stroke="rgba(245,200,66,0.18)" stroke-width="1.2" stroke-dasharray="4 3"/>`;

    const mvMin = Math.min(...mvAll), mvMax = Math.max(...mvAll);
    TEAMS.forEach((t) => {
      const r = 4 + (t.mv - mvMin) / (mvMax - mvMin) * 8;
      const col = CONF_COLORS[t.conf];
      svg.innerHTML += `<circle cx="${xPos(t.pts)}" cy="${yPos(t.prob)}" r="${r}" fill="${col}" opacity="0.8" stroke="#000" stroke-width="1" style="cursor:pointer"/>`;
      if (t.prob > 0.72) {
        svg.innerHTML += `<text x="${xPos(t.pts)}" y="${yPos(t.prob) - r - 4}" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="8" font-family="Montserrat" font-weight="800">${t.name}</text>`;
      }
    });
  }, [inView]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHead}>
        <span className={styles.chartTitle}>FIFA Points vs Win Prob</span>
        <span className={styles.chartSub}>Bubble size = Market Value</span>
      </div>
      <div ref={wrapRef} className={styles.chartBodyScatter}>
        <svg ref={svgRef} style={{ width: '100%', overflow: 'visible' }} />
      </div>
    </div>
  );
}

/* ─── Main ChartsPanel ─── */
export default function ChartsPanel({ activeTeam, onTeamSelect }) {
  return (
    <div className={styles.panel}>
      <ProbSpectrum activeTeam={activeTeam} onTeamSelect={onTeamSelect} />
      <ModelComparer />
      <div className={styles.grid2}>
        <CVLineChart />
        <Histogram />
      </div>
      <div className={styles.grid2}>
        <ScatterPlot />
        <FeatureImportance />
      </div>
    </div>
  );
}
