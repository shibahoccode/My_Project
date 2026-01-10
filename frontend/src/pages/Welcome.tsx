import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Drum, LogIn, UserPlus, Loader2 } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/play');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 mb-8 relative"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0 0 rgba(168, 85, 247, 0)",
              "0 0 40px 10px rgba(168, 85, 247, 0.3)",
              "0 0 0 0 rgba(168, 85, 247, 0)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Drum className="w-14 h-14 text-primary" />
          
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-5xl md:text-7xl font-display font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-primary drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">DRUM</span>
          <span className="text-foreground ml-3">MACHINE</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Chào mừng đến với thế giới
        </motion.p>

        <motion.p 
          className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Trống Điện Tử
        </motion.p>

        {/* Drum Pads Preview */}
        <motion.div 
          className="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="aspect-square rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(168, 85, 247, 0)",
                  "0 0 20px 5px rgba(168, 85, 247, 0.3)",
                  "0 0 0 0 rgba(168, 85, 247, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            size="lg"
            className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300"
            onClick={() => navigate('/auth?mode=login')}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Đăng nhập
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-lg font-semibold border-2 border-primary/50 hover:border-primary hover:bg-primary/10 text-foreground transition-all duration-300"
            onClick={() => navigate('/auth?mode=register')}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Đăng ký
          </Button>
        </motion.div>

        {/* Footer text */}
        <motion.p 
          className="mt-12 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          Tạo nhịp điệu • Thể hiện phong cách • Kết nối âm nhạc
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Welcome;
