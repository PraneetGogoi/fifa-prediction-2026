'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabaseClient';
import styles from './LiveChat.module.css';

export default function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Generate a random username for the session
  const [author] = useState(() => `User_${Math.floor(Math.random() * 10000)}`);

  useEffect(() => {
    // 1. Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (!error && data) {
        setMessages(data);
      }
    };
    fetchMessages();

    // 2. Subscribe to realtime inserts
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);
    const { error } = await supabase
      .from('messages')
      .insert([{ content: input.trim(), author }]);

    if (!error) {
      setInput('');
    } else {
      console.error('Error sending message:', error);
    }
    setIsSending(false);
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>Global Match Feed</div>
        <div className={styles.sub}>LIVE DISCUSSION • POWERED BY SUPABASE</div>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={styles.messageRow}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
              >
                <div className={styles.msgHeader}>
                  <span className={styles.author}>{msg.author}</span>
                  <span className={styles.time}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={styles.content}>{msg.content}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <form className={styles.inputForm} onSubmit={sendMessage}>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Broadcast to global feed..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
          />
          <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isSending}>
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}
