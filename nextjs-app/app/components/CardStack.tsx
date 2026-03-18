'use client';

import { motion } from 'framer-motion';

export default function CardStack({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-black/5"
    >
      {children}
    </motion.div>
  );
}
