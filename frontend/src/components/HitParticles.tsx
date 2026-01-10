import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface HitParticlesProps {
  trigger: number;
  color: string;
}

export const HitParticles = ({ trigger, color }: HitParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const newParticles = [...Array(8)].map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        color,
      }));
      
      setParticles(prev => [...prev, ...newParticles]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 600);
    }
  }, [trigger, color]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: particle.color,
              left: '50%',
              top: '50%',
              boxShadow: `0 0 10px ${particle.color}`,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 1, 
              opacity: 1 
            }}
            animate={{ 
              x: particle.x, 
              y: particle.y, 
              scale: 0, 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
