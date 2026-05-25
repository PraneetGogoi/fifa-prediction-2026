'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';
import { TEAMS } from '@/data/dashboardData';
import styles from './Sandbox.module.css';

export default function Sandbox() {
  const [weights, setWeights] = useState({
    rating: 50,
    form: 50,
    mv: 50
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Calculate the custom winner dynamically
  const predictedWinner = useMemo(() => {
    let maxScore = -1;
    let winner = TEAMS[0];

    TEAMS.forEach(team => {
      // Normalize values to a 0-100 scale roughly
      const normRating = (team.rating / 90) * 100;
      const normForm = (team.form / 10) * 100;
      const normMV = Math.min((team.mv / 1000) * 100, 100);

      const wRating = weights.rating / 100;
      const wForm = weights.form / 100;
      const wMV = weights.mv / 100;

      const score = (normRating * wRating) + (normForm * wForm) + (normMV * wMV);

      if (score > maxScore) {
        maxScore = score;
        winner = team;
      }
    });

    return winner.name;
  }, [weights]);

  const handleSave = async () => {
    if (saved) return;
    setIsSaving(true);
    
    const { error } = await supabase
      .from('user_predictions')
      .insert([{ custom_winner: predictedWinner, weights }]);
      
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      console.error('Error saving prediction', error);
    }
    setIsSaving(false);
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>My Predictions Sandbox</div>
        <div className={styles.sub}>ADJUST AI WEIGHTS TO GENERATE YOUR OWN OUTCOME</div>
      </div>

      <div className={styles.content}>
        <div className={styles.slidersCol}>
          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.label}>Importance of Squad Rating</span>
              <span className={styles.valBadge}>{weights.rating}%</span>
            </div>
            <input 
              type="range" 
              className={styles.rangeInput} 
              min="0" max="100" 
              value={weights.rating} 
              onChange={e => setWeights(prev => ({...prev, rating: parseInt(e.target.value)}))}
            />
          </div>

          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.label}>Importance of Recent Form</span>
              <span className={styles.valBadge}>{weights.form}%</span>
            </div>
            <input 
              type="range" 
              className={styles.rangeInput} 
              min="0" max="100" 
              value={weights.form} 
              onChange={e => setWeights(prev => ({...prev, form: parseInt(e.target.value)}))}
            />
          </div>

          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.label}>Importance of Market Value</span>
              <span className={styles.valBadge}>{weights.mv}%</span>
            </div>
            <input 
              type="range" 
              className={styles.rangeInput} 
              min="0" max="100" 
              value={weights.mv} 
              onChange={e => setWeights(prev => ({...prev, mv: parseInt(e.target.value)}))}
            />
          </div>
        </div>

        <div className={styles.resultCol}>
          <span className={styles.resultTitle}>YOUR CUSTOM PREDICTION</span>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={predictedWinner}
              className={styles.winnerName}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {predictedWinner}
            </motion.div>
          </AnimatePresence>

          <button 
            className={styles.saveBtn} 
            onClick={handleSave}
            disabled={isSaving || saved}
          >
            {saved ? 'SAVED TO DB ✓' : isSaving ? 'SAVING...' : 'SAVE TO DATABASE'}
          </button>
        </div>
      </div>
    </div>
  );
}
