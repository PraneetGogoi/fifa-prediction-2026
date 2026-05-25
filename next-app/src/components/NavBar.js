'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './NavBar.module.css';

export default function NavBar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Teams', path: '/teams' },
    { name: 'Community', path: '/community' },
  ];

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  
  const GlitchLink = ({ item, isActive }) => {
    const [text, setText] = useState(item.name);
    const intervalRef = useRef(null);

    const handleHover = () => {
      let iterations = 0;
      clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setText(item.name.split('').map((char, index) => {
          if (index < iterations) return item.name[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(''));
        
        if (iterations >= item.name.length) {
          clearInterval(intervalRef.current);
          setText(item.name);
        }
        iterations += 1/3;
      }, 30);
    };

    const handleLeave = () => {
      clearInterval(intervalRef.current);
      setText(item.name);
    };

    return (
      <Link 
        href={item.path} 
        className={`${styles.link} ${isActive ? styles.active : ''}`}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        {text}
      </Link>
    );
  };

  const AnimatedLogo = () => (
    <motion.svg 
      width="32" 
      height="32" 
      viewBox="0 0 100 100" 
      style={{ overflow: 'visible' }}
    >
      <motion.circle 
        cx="50" cy="50" r="40" 
        stroke="var(--blue-light)" 
        strokeWidth="2" 
        fill="none" 
        strokeDasharray="40 20"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle 
        cx="50" cy="50" r="25" 
        stroke="var(--magenta)" 
        strokeWidth="4" 
        fill="none" 
        strokeDasharray="20 40"
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle 
        cx="50" cy="50" r="10" 
        fill="var(--gold)" 
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );

  return (
    <motion.nav 
      className={styles.navbar}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <Link href="/" className={styles.brand}>
        <AnimatedLogo /> <span>DEEP-KICK</span>
      </Link>

      <div className={styles.links}>
        {navItems.map(item => (
          <GlitchLink key={item.path} item={item} isActive={pathname === item.path} />
        ))}
      </div>

      <Link href="/dashboard" className={styles.launchBtn}>
        LAUNCH AI
      </Link>
    </motion.nav>
  );
}
