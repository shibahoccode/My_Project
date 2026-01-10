import { useCallback, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DrumPad } from './DrumPad';
import { AudioVisualizer } from './AudioVisualizer';
import { VolumeControl } from './VolumeControl';
import { HitCounter } from './HitCounter';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface DrumConfig {
  id: string;
  label: string;
  key: string;
  color: string;
}

const drumConfig: DrumConfig[] = [
  { id: 'crash', label: 'Crash', key: 'Q', color: 'hsl(120, 100%, 45%)' },
  { id: 'hihat', label: 'Hi-Hat', key: 'W', color: 'hsl(180, 100%, 50%)' },
  { id: 'openHihat', label: 'Open HH', key: 'E', color: 'hsl(160, 100%, 50%)' },
  { id: 'ride', label: 'Ride', key: 'R', color: 'hsl(200, 100%, 60%)' },
  { id: 'tom', label: 'Tom', key: 'A', color: 'hsl(280, 100%, 60%)' },
  { id: 'snare', label: 'Snare', key: 'S', color: 'hsl(45, 100%, 50%)' },
  { id: 'clap', label: 'Clap', key: 'D', color: 'hsl(330, 100%, 60%)' },
  { id: 'floorTom', label: 'Floor Tom', key: 'F', color: 'hsl(25, 100%, 55%)' },
  { id: 'kick', label: 'Kick', key: 'SPACE', color: 'hsl(0, 85%, 55%)' },
];

const keyMap: Record<string, string> = {
  'q': 'crash',
  'w': 'hihat',
  'e': 'openHihat',
  'r': 'ride',
  'a': 'tom',
  's': 'snare',
  'd': 'clap',
  'f': 'floorTom',
  ' ': 'kick',
};

const COMBO_TIMEOUT = 1500; // ms

export const DrumKit = () => {
  const { playSound, volume, updateVolume } = useAudioEngine();
  const [activePads, setActivePads] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastHitTime, setLastHitTime] = useState(0);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerPad = useCallback((padId: string) => {
    playSound(padId);
    setActivePads(prev => new Set(prev).add(padId));
    setIsPlaying(true);
    
    // Update stats
    const now = Date.now();
    setTotalHits(prev => prev + 1);
    setLastHitTime(now);
    
    // Update combo
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
    }
    setCombo(prev => prev + 1);
    
    comboTimeoutRef.current = setTimeout(() => {
      setCombo(0);
    }, COMBO_TIMEOUT);
    
    // Clear active state
    setTimeout(() => {
      setActivePads(prev => {
        const next = new Set(prev);
        next.delete(padId);
        return next;
      });
    }, 100);

    // Clear playing state
    setTimeout(() => {
      setIsPlaying(false);
    }, 200);
  }, [playSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      
      const key = e.key.toLowerCase();
      const padId = keyMap[key];
      
      if (padId) {
        e.preventDefault();
        triggerPad(padId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerPad]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Stats and Controls */}
      <motion.div 
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <HitCounter 
          totalHits={totalHits} 
          combo={combo} 
          lastHitTime={lastHitTime} 
        />
        <VolumeControl volume={volume} onChange={updateVolume} />
      </motion.div>

      {/* Audio Visualizer */}
      <motion.div 
        className="mb-6 glass-panel py-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AudioVisualizer isActive={isPlaying} />
      </motion.div>

      {/* Top row - cymbals */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
        {drumConfig.slice(0, 4).map((drum, index) => (
          <motion.div
            key={drum.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <DrumPad
              id={drum.id}
              label={drum.label}
              keyHint={drum.key}
              color={drum.color}
              isActive={activePads.has(drum.id)}
              onPlay={() => triggerPad(drum.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Middle row - toms and snare */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
        {drumConfig.slice(4, 8).map((drum, index) => (
          <motion.div
            key={drum.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <DrumPad
              id={drum.id}
              label={drum.label}
              keyHint={drum.key}
              color={drum.color}
              isActive={activePads.has(drum.id)}
              onPlay={() => triggerPad(drum.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom row - kick */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div 
          className="drum-pad w-full max-w-md h-24 md:h-28 cursor-pointer"
          onClick={() => triggerPad(drumConfig[8].id)}
          role="button"
          tabIndex={0}
        >
          <div
            className="drum-pad-glow"
            style={{ backgroundColor: drumConfig[8].color }}
          />
          <div className="relative z-10 flex items-center justify-center gap-4">
            <motion.span 
              className="drum-label text-lg"
              style={{ color: drumConfig[8].color }}
              animate={{
                textShadow: activePads.has(drumConfig[8].id) 
                  ? `0 0 10px ${drumConfig[8].color}, 0 0 20px ${drumConfig[8].color}`
                  : 'none',
              }}
            >
              {drumConfig[8].label}
            </motion.span>
            <span className="key-hint">{drumConfig[8].key}</span>
          </div>
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: `2px solid ${drumConfig[8].color}`,
            }}
            animate={{
              opacity: activePads.has(drumConfig[8].id) ? 1 : 0,
              boxShadow: activePads.has(drumConfig[8].id) 
                ? `inset 0 0 20px ${drumConfig[8].color}40` 
                : 'none',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
