
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DrumKit } from '@/components/DrumKit';
import { ReviewsSection } from '@/components/ReviewsSection';
import { NavigationTabs } from '@/components/NavigationTabs'; // THÊM MỚI
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const Index = () => {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Bảo vệ trang: Nếu chưa đăng nhập thì đá về trang chủ
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
  };

  // Nếu đang tải thông tin user thì chưa hiện giao diện (tránh chớp nháy)
  if (loading) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-primary/5 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-secondary/5 blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* THÊM MỚI: Navigation Tabs giữa màn hình */}
      <NavigationTabs />

      {/* User Bar - Chỉ còn username và logout */}
      <motion.div
        className="absolute top-4 right-4 z-20 flex items-center gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs text-muted-foreground hidden sm:block font-medium">
          Xin chào, <span className="text-primary">{user?.username}</span>
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </Button>
      </motion.div>

      {/* Header - THÊM mt-16 để tránh bị che */}
      <motion.header
        className="py-6 md:py-8 text-center relative z-10 mt-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-display font-bold tracking-wider"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <motion.span
            className="text-primary inline-block"
            animate={{
              textShadow: [
                '0 0 10px hsl(180, 100%, 50%)',
                '0 0 20px hsl(180, 100%, 50%)',
                '0 0 10px hsl(180, 100%, 50%)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            DRUM
          </motion.span>
          <span className="text-foreground ml-2">MACHINE</span>
        </motion.h1>
        <motion.p
          className="text-muted-foreground mt-2 text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Click hoặc dùng phím tắt để chơi
        </motion.p>
      </motion.header>

      {/* Drum Kit Section */}
      <main className="flex items-center justify-center px-4 pb-8 relative z-10">
        <motion.div
          className="glass-panel w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <DrumKit />

          {/* Instructions */}
          <motion.div
            className="mt-6 pt-6 border-t border-border/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-muted font-display">Q W E R</span>
                <span>Cymbals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-muted font-display">A S D F</span>
                <span>Drums</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-muted font-display">SPACE</span>
                <span>Kick</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Divider */}
      <div className="max-w-4xl mx-auto w-full px-4 relative z-10">
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
      </div>

      {/* Reviews Section */}
      <div className="relative z-10">
        <ReviewsSection />
      </div>

      {/* Footer */}
      <motion.footer
        className="py-6 text-center text-xs text-muted-foreground border-t border-border/30 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p>Electronic Drum Kit - Đồ án tổng hợp</p>
        <p className="mt-1">© 2024 - Tích hợp Google & Facebook Reviews</p>
      </motion.footer>
    </div>
  );
};

export default Index;