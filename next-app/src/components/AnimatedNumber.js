'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValueEvent } from 'framer-motion';

export default function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  // We use Framer Motion's useSpring to transition the value smoothly over time
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useMotionValueEvent(springValue, 'change', (latest) => {
    setDisplayValue(latest.toFixed(decimals));
  });

  return (
    <motion.span>
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
}
