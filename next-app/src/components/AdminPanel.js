'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handlePush = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    setIsSending(true);

    const { error } = await supabase
      .from('live_updates')
      .insert([{ message: message.trim() }]);

    if (!error) {
      setMessage('');
    } else {
      console.error('Error pushing update:', error);
    }
    setIsSending(false);
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Admin Override: Ticker Broadcast</div>
        <div className={styles.sub}>PUSH LIVE UPDATES TO ALL CONNECTED CLIENTS</div>
      </div>
      <form className={styles.inputForm} onSubmit={handlePush}>
        <input 
          type="text" 
          className={styles.inputField} 
          placeholder="e.g. ⚽ GOAL! Mbappe scores in the 89th minute!" 
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={isSending}
        />
        <button type="submit" className={styles.pushBtn} disabled={!message.trim() || isSending}>
          {isSending ? 'PUSHING...' : 'BROADCAST'}
        </button>
      </form>
    </div>
  );
}
