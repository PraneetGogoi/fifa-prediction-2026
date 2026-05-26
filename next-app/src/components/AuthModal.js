'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import styles from './AuthModal.module.css';

export default function AuthModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let authError = null;

    if (isLogin) {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password });
      authError = e;
    } else {
      const { error: e } = await supabase.auth.signUp({ email, password });
      authError = e;
      if (!e) alert("Check your email for the confirmation link!");
    }

    if (authError) {
      setError(authError.message);
    } else {
      if (isLogin) onClose();
    }
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2 className={styles.title}>{isLogin ? 'SYSTEM LOGIN' : 'CREATE ACCOUNT'}</h2>
        
        <form onSubmit={handleAuth} className={styles.form}>
          <input 
            type="email" 
            placeholder="EMAIL ADDRESS" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={styles.input}
            required 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={styles.input}
            required 
          />
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'PROCESSING...' : (isLogin ? 'AUTHENTICATE' : 'INITIALIZE')}
          </button>
        </form>

        <div className={styles.toggleText}>
          {isLogin ? "Don't have access? " : "Already registered? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Request access.' : 'Login here.'}
          </span>
        </div>
      </div>
    </div>
  );
}
