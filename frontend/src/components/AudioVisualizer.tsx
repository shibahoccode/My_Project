import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isActive: boolean;
}

export const AudioVisualizer = ({ isActive }: AudioVisualizerProps) => {
  const bars = 20;

  return (
    <div className="flex items-end justify-center gap-1 h-16 px-4">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-full bg-gradient-to-t from-primary to-secondary"
          initial={{ height: 4 }}
          animate={{
            height: isActive 
              ? [4, Math.random() * 50 + 10, 4]
              : [4, Math.random() * 8 + 4, 4],
          }}
          transition={{
            duration: isActive ? 0.15 : 1.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
