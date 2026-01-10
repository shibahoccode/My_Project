// src/components/NavigationTabs.tsx
import { motion } from 'framer-motion';
import { Music, ShoppingBag, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const NavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isPlayPage = location.pathname === '/play';
  const isShopPage = location.pathname === '/shop';
  const isReviewPage = location.pathname === '/review';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
      {/* Nút Chơi Trống */}
      <motion.button
        onClick={() => navigate('/play')}
        className={`
          relative px-6 py-3 rounded-full font-semibold text-sm
          flex items-center gap-2 transition-all duration-300
          ${isPlayPage 
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50' 
            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 backdrop-blur-sm'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Music className="w-4 h-4" />
        <span>Chơi trống</span>
        
        {isPlayPage && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
            style={{ zIndex: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>

      {/* Nút Khám phá sản phẩm */}
      <motion.button
        onClick={() => navigate('/shop')}
        className={`
          relative px-6 py-3 rounded-full font-semibold text-sm
          flex items-center gap-2 transition-all duration-300
          ${isShopPage 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50' 
            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 backdrop-blur-sm'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Khám phá sản phẩm</span>
        
        {isShopPage && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            style={{ zIndex: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>

      {/* Nút Đánh giá - MỚI */}
      <motion.button
        onClick={() => navigate('/review')}
        className={`
          relative px-6 py-3 rounded-full font-semibold text-sm
          flex items-center gap-2 transition-all duration-300
          ${isReviewPage 
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50' 
            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 backdrop-blur-sm'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Star className="w-4 h-4" />
        <span>Đánh giá</span>
        
        {isReviewPage && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
            style={{ zIndex: -1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>
    </div>
  );
};