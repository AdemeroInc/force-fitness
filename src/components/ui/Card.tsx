'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6', 
  lg: 'p-8'
};

export default function Card({ 
  children, 
  className = '', 
  hover = true,
  padding = 'md'
}: CardProps) {
  const baseClasses = 'bg-white rounded-lg shadow-lg border border-gray-100';
  const classes = `${baseClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { 
        scale: 1.02, 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
      } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
}