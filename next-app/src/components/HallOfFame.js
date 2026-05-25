'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import styles from './HallOfFame.module.css';

export default function HallOfFame() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const { data, error } = await supabase
        .from('user_predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setPredictions(data);
      }
    };

    fetchPredictions();

    const channel = supabase
      .channel('public:user_predictions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_predictions' },
        (payload) => {
          setPredictions(prev => [payload.new, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Hall of Fame</div>
        <div className={styles.sub}>LATEST CUSTOM PREDICTIONS FROM THE SANDBOX</div>
      </div>

      <div className={styles.list}>
        {predictions.map(p => (
          <div key={p.id} className={styles.row}>
            <div>
              <div className={styles.winner}>{p.custom_winner}</div>
              <div className={styles.weights}>
                Rating: <span>{p.weights.rating}%</span>
                Form: <span>{p.weights.form}%</span>
                Value: <span>{p.weights.mv}%</span>
              </div>
            </div>
            <div className={styles.time}>
              {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {predictions.length === 0 && (
          <div style={{ color: 'var(--text-lo)', fontSize: '0.8rem', textAlign: 'center', marginTop: '20px' }}>
            No custom predictions saved yet. Be the first to use the Sandbox!
          </div>
        )}
      </div>
    </div>
  );
}
