import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

interface HitCounterProps {
  totalHits: number;
  combo: number;
  lastHitTime: number;
}

export const HitCounter = ({ totalHits, combo, lastHitTime }: HitCounterProps) => {
  const isOnFire = combo >= 10;
  const isComboActive = combo >= 3;

  return (
    <motion.div 
      className="flex items-center gap-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Total Hits */}
      <div className="glass-panel px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">Tổng số hit</p>
        <motion.p 
          className="text-2xl font-display font-bold text-foreground"
          key={totalHits}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          {totalHits}
        </motion.p>
      </div>

      {/* Combo */}
      <div className="glass-panel px-4 py-3 text-center relative overflow-hidden">
        <AnimatePresence>
          {isOnFire && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-1 justify-center mb-1">
          <p className="text-xs text-muted-foreground">Combo</p>
          <AnimatePresence>
            {isOnFire && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Flame size={14} className="text-orange-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.p 
          className={`text-2xl font-display font-bold ${
            isOnFire ? 'text-orange-500' : isComboActive ? 'text-primary' : 'text-foreground'
          }`}
          key={combo}
          initial={{ scale: 1.5, y: -10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          {combo}x
        </motion.p>

        {/* Combo message */}
        <AnimatePresence>
          {isComboActive && (
            <motion.p
              className={`text-[10px] font-medium ${isOnFire ? 'text-orange-400' : 'text-primary'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {isOnFire ? '🔥 ON FIRE!' : combo >= 5 ? '⚡ GREAT!' : 'NICE!'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
