'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';
import styles from './Ticker.module.css';

export default function Ticker() {
  const [messages, setMessages] = useState(['⚽ WORLD CUP 2026 PREDICTIONS LIVE • AWAITING ADMIN DATA...']);

  const [windowWidth, setWindowWidth] = useState(1000);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    // 1. Fetch the latest 5 updates
    const fetchUpdates = async () => {
      const { data, error } = await supabase
        .from('live_updates')
        .select('message')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data && data.length > 0) {
        setMessages(data.map(d => d.message));
      }
    };
    fetchUpdates();

    // 2. Subscribe to realtime inserts
    const channel = supabase
      .channel('public:live_updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'live_updates' },
        (payload) => {
          setMessages(prev => [payload.new.message, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Join the latest messages into one long ticker string
  const tickerText = messages.join('  •  ');

  return (
    <div className={styles.tickerContainer}>
      <motion.div
        className={styles.tickerText}
        animate={{ x: [windowWidth, -1000] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        }}
      >
        {tickerText}  •  {tickerText}
      </motion.div>
    </div>
  );
}
