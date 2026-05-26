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
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" stroke="url(#paint0_linear_nav)" strokeWidth="3"/>
      <path d="M20 4 C12 12 12 28 20 36 C28 28 28 12 20 4 Z" stroke="url(#paint1_linear_nav)" strokeWidth="2"/>
      <path d="M4 20 C12 12 28 12 36 20 C28 28 12 28 4 20 Z" stroke="url(#paint2_linear_nav)" strokeWidth="2"/>
      <defs>
        <linearGradient id="paint0_linear_nav" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff007f"/>
          <stop offset="1" stopColor="#00e1ff"/>
        </linearGradient>
        <linearGradient id="paint1_linear_nav" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC900"/>
          <stop offset="1" stopColor="#ff007f"/>
        </linearGradient>
        <linearGradient id="paint2_linear_nav" x1="4" y1="20" x2="36" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ff88"/>
          <stop offset="1" stopColor="#00e1ff"/>
        </linearGradient>
      </defs>
    </svg>
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

      <button 
        onClick={() => window.dispatchEvent(new Event('open-ai-assistant'))} 
        className={styles.launchBtn}
      >
        LAUNCH AI
      </button>
    </motion.nav>
  );
}
