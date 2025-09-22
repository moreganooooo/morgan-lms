import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

export const spring = { type: 'spring' as const, stiffness: 380, damping: 30, mass: 0.6 };

export const CardMotion: React.FC<HTMLMotionProps<'div'>> = (props) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 6 }}
    transition={spring}
    {...props}
  />
);