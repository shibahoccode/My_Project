import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HitParticles } from './HitParticles';

interface DrumPadProps {
  id: string;
  label: string;
  keyHint: string;
  color: string;
  isActive: boolean;
  onPlay: () => void;
}

export const DrumPad = ({ id, label, keyHint, color, isActive, onPlay }: DrumPadProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [hitCount, setHitCount] = useState(0);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
    setHitCount(prev => prev + 1);
    onPlay();
  }, [onPlay]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false);
  }, []);

  const isTriggered = isActive || isPressed;

  return (
    <motion.div
      className={cn(
        'drum-pad w-full aspect-square relative',
        isTriggered && 'active'
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      role="button"
      tabIndex={0}
      aria-label={`${label} drum pad, press ${keyHint} key`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: isTriggered 
          ? `0 0 30px ${color}60, inset 0 0 20px ${color}30`
          : '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
      transition={{ duration: 0.1 }}
    >
      {/* Particles */}
      <HitParticles trigger={hitCount} color={color} />

      {/* Glow effect */}
      <motion.div
        className="drum-pad-glow"
        style={{ backgroundColor: color }}
        animate={{ opacity: isTriggered ? 0.6 : 0 }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Ripple effect */}
      {isTriggered && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ border: `2px solid ${color}` }}
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 p-4">
        <motion.span 
          className="drum-label transition-all duration-100"
          style={{ color }}
          animate={{
            textShadow: isTriggered 
              ? `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`
              : 'none',
            scale: isTriggered ? 1.1 : 1,
          }}
          transition={{ duration: 0.1 }}
        >
          {label}
        </motion.span>
        <span className="key-hint">{keyHint}</span>
      </div>

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: `2px solid ${color}`,
        }}
        animate={{
          opacity: isTriggered ? 1 : 0,
          boxShadow: isTriggered ? `inset 0 0 20px ${color}40` : 'none',
        }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};
