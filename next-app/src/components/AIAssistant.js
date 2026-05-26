'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAMS } from '@/data/dashboardData';
import styles from './AIAssistant.module.css';

// Mock AI Engine
const getAIResponse = (input) => {
  const lower = input.toLowerCase();
  
  if (lower.includes('winner') || lower.includes('win')) {
    return "Our ensemble neural network predicts Spain has the highest probability (82.2%) of winning, closely followed by France (82.0%).";
  }
  if (lower.includes('underdog') || lower.includes('dark horse')) {
    return "Croatia and Morocco are strong dark horses this year, outperforming their baseline market values.";
  }
  if (lower.includes('usa') || lower.includes('america')) {
    return "The USA has a 64.7% win probability against average opponents, but their recent form index of 5.53 suggests some instability.";
  }
  if (lower.includes('hello') || lower.includes('hi')) {
    return "Hello. I am the Neural WC26 Intelligence Core. How can I assist your predictive models today?";
  }
  if (lower.includes('features') || lower.includes('data')) {
    return "We use Squad Quality, Strength Index, Market Value, FIFA Points, and Recent Form as the primary features in the XGBoost model.";
  }
  
  return "I'm currently running scenario simulations. Could you rephrase your query regarding the 2026 World Cup data?";
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'SYSTEM ONLINE. AWAITING INQUIRY...' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getAIResponse(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 1000); // Simulate network latency
  };

  return (
    <>
      <div className={styles.fab} onClick={() => setIsOpen(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.statusDot} />
                <span className={styles.title}>NEURAL ASSISTANT</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className={styles.messageList}>
              {messages.map((msg, i) => (
                <div key={i} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.userWrap : styles.aiWrap}`}>
                  <div className={`${styles.messageBox} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={`${styles.messageWrapper} ${styles.aiWrap}`}>
                  <div className={`${styles.messageBox} ${styles.aiMsg}`}>
                    <span className={styles.dotPulse}></span>
                    <span className={styles.dotPulse}></span>
                    <span className={styles.dotPulse}></span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} className={styles.inputArea}>
              <input 
                type="text" 
                className={styles.inputField} 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="ASK ABOUT PREDICTIONS..."
              />
              <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
