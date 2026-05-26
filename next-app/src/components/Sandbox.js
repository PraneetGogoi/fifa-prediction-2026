'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';
import { TEAMS } from '@/data/dashboardData';
import styles from './Sandbox.module.css';

export default function Sandbox() {
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0].name);
  const [modifiers, setModifiers] = useState({
    injury: 0, // -100 to 0
    fatigue: 0, // -100 to 0
    crowd: 0 // 0 to 100
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const team = TEAMS.find(t => t.name === selectedTeam);

  // Calculate the custom probability dynamically
  const customProb = useMemo(() => {
    if (!team) return 0;
    
    // Base probability from neural network
    let base = team.prob * 100;
    
    // Apply modifiers (simple linear adjustments for demo)
    // Injury impacts heavily (-20% at max)
    const injuryHit = (modifiers.injury / 100) * 20; 
    // Fatigue impacts moderately (-10% at max)
    const fatigueHit = (modifiers.fatigue / 100) * 10;
    // Crowd boosts slightly (+5% at max)
    const crowdBoost = (modifiers.crowd / 100) * 5;

    let finalProb = base + injuryHit + fatigueHit + crowdBoost;
    // Cap between 0 and 100
    finalProb = Math.max(0, Math.min(100, finalProb));
    
    return finalProb;
  }, [team, modifiers]);

  const handleSave = async () => {
    if (saved) return;
    setIsSaving(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || 'Anonymous';

    const { error } = await supabase
      .from('user_predictions')
      .insert([{ custom_winner: selectedTeam, weights: modifiers, user_email: userEmail }]);
      
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
        <div className={styles.title}>What-If Scenario Engine</div>
        <div className={styles.sub}>ADJUST MATCH VARIABLES TO RECALCULATE PROBABILITY</div>
      </div>

      <div className={styles.content}>
        <div className={styles.slidersCol}>
          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.label}>Select Team</span>
            </div>
            <select 
              className={styles.selectInput}
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
            >
              {TEAMS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>

          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.label}>Key Player Injury / Form</span>
              <span className={styles.valBadge}>{modifiers.injury}%</span>
            </div>
            <input 
              type="range" 
              className={styles.rangeInput} 
              min="-100" max="0" 
              value={modifiers.injury} 
              onChange={e => setModifiers(prev => ({...prev, injury: parseInt(e.target.value)}))}
            />
          </div>

          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.label}>Tournament Fatigue</span>
              <span className={styles.valBadge}>{modifiers.fatigue}%</span>
            </div>
            <input 
              type="range" 
              className={styles.rangeInput} 
              min="-100" max="0" 
              value={modifiers.fatigue} 
              onChange={e => setModifiers(prev => ({...prev, fatigue: parseInt(e.target.value)}))}
            />
          </div>

          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.label}>Home Crowd Advantage</span>
              <span className={styles.valBadge}>+{modifiers.crowd}%</span>
            </div>
            <input 
              type="range" 
              className={styles.rangeInput} 
              min="0" max="100" 
              value={modifiers.crowd} 
              onChange={e => setModifiers(prev => ({...prev, crowd: parseInt(e.target.value)}))}
            />
          </div>
        </div>

        <div className={styles.resultCol}>
          <span className={styles.resultTitle}>ADJUSTED WIN PROBABILITY</span>
          
          <div className={styles.winnerName}>
            {selectedTeam}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={customProb}
              className={styles.probValue}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {customProb.toFixed(1)}%
            </motion.div>
          </AnimatePresence>

          <button 
            className={styles.saveBtn} 
            onClick={handleSave}
            disabled={isSaving || saved}
          >
            {saved ? 'SAVED TO DB ✓' : isSaving ? 'SAVING...' : 'SAVE SCENARIO'}
          </button>
        </div>
      </div>
    </div>
  );
}
