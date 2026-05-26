'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import styles from './page.module.css';

export default function LeaderboardPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPredictions() {
      const { data, error } = await supabase
        .from('user_predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setPredictions(data);
      }
      setLoading(false);
    }
    fetchPredictions();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Global Predictions</h1>
        <p className={styles.subtitle}>LIVE SCENARIOS FROM INTELLIGENCE OPERATIVES</p>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>SYNCING WITH MAINFRAME...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>OPERATIVE (USER)</th>
                  <th>PREDICTED CHAMPION</th>
                  <th>MODIFIERS APPLIED</th>
                  <th>TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p, i) => (
                  <tr key={p.id || i}>
                    <td>{p.user_email?.split('@')[0] || 'Anonymous'}</td>
                    <td className={styles.winnerCol}>{p.custom_winner}</td>
                    <td className={styles.weightsCol}>
                      {p.weights ? (
                        <>
                          <span className={styles.badge}>INJ: {p.weights.injury || 0}</span>
                          <span className={styles.badge}>FAT: {p.weights.fatigue || 0}</span>
                          <span className={styles.badge}>CRW: {p.weights.crowd || 0}</span>
                        </>
                      ) : (
                        'Standard Parameters'
                      )}
                    </td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {predictions.length === 0 && (
                  <tr>
                    <td colSpan="4" className={styles.emptyRow}>NO PREDICTIONS FOUND IN DATABASE</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
