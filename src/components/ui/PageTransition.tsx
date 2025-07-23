'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    rotateY: -5,
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    y: -20,
    rotateY: 5,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const overlayVariants = {
  initial: {
    scaleX: 0,
  },
  enter: {
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    scaleX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: 0.2,
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Premium Transition Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`overlay-${pathname}`}
          className="fixed inset-0 z-[9998] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 origin-left"
          variants={overlayVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          style={{ transformOrigin: '0% 50%' }}
        />
      </AnimatePresence>

      {/* Page Content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="relative z-10"
          style={{ perspective: '1000px' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}