'use client';
import { motion } from 'framer-motion';

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
