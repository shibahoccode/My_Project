import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
}

export const VolumeControl = ({ volume, onChange }: VolumeControlProps) => {
  const isMuted = volume === 0;

  return (
    <motion.div 
      className="flex items-center gap-3 glass-panel px-4 py-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <button 
        onClick={() => onChange(isMuted ? 0.7 : 0)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <Slider
        value={[volume * 100]}
        onValueChange={([val]) => onChange(val / 100)}
        max={100}
        step={1}
        className="w-32"
      />
      <span className="text-xs text-muted-foreground font-display w-10">
        {Math.round(volume * 100)}%
      </span>
    </motion.div>
  );
};
