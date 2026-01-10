import { motion } from 'framer-motion';
import { ReviewCard } from './ReviewCard';
import { Star, TrendingUp, AlertCircle } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

/* ===== Interface khớp ReviewPublicResponse ===== */
interface Review {
  id: number;
  fullname: string;
  avatar: string;
  rating: number;
  review: string;
  source: 'google' | 'facebook';
  date: string;
}

/* ===== Animation variants ===== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ===== API Configuration ===== */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_ENDPOINT = `${API_BASE_URL}/api/reviews`;

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===== Fetch PUBLIC reviews ===== */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Validate và chuẩn hóa data
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        const normalized = data.map(r => {
          // Validate source
          const source = r.source?.toLowerCase();
          if (source !== 'google' && source !== 'facebook') {
            console.warn(`Invalid source for review ${r.id}: ${r.source}`);
            return {
              ...r,
              source: 'google' as const, // fallback
            };
          }

          return {
            id: r.id,
            fullname: r.fullname || 'Anonymous',
            avatar: r.avatar || '?',
            rating: Math.min(Math.max(r.rating || 0, 0), 5), // clamp 0-5
            review: r.review || '',
            source: source as 'google' | 'facebook',
            date: r.date || new Date().toISOString(),
          };
        });

        setReviews(normalized);
      } catch (error) {
        console.error('❌ Không lấy được reviews:', error);
        setError(
          error instanceof Error 
            ? error.message 
            : 'Không thể tải đánh giá. Vui lòng thử lại sau.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  /* ===== Memoized Stats ===== */
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : '0.0';
    const googleReviews = reviews.filter(r => r.source === 'google').length;
    const facebookReviews = reviews.filter(r => r.source === 'facebook').length;

    return { totalReviews, averageRating, googleReviews, facebookReviews };
  }, [reviews]);

  /* ===== Loading UI ===== */
  if (loading) {
    return (
      <section className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="w-6 h-6" />
          </motion.div>
          <span>Đang tải đánh giá...</span>
        </div>
      </section>
    );
  }

  /* ===== Error UI ===== */
  if (error) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="glass-panel p-6 text-center border-2 border-red-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Không thể tải đánh giá
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  /* ===== Empty State ===== */
  if (reviews.length === 0) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Star className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Chưa có đánh giá
            </h3>
            <p className="text-muted-foreground">
              Hãy là người đầu tiên để lại đánh giá của bạn!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  /* ===== Main Content ===== */
  return (
    <section className="py-12 px-4" aria-label="Customer Reviews Section">
      <div className="max-w-6xl mx-auto">

        {/* ===== Header ===== */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            <span className="text-foreground">Đánh giá từ </span>
            <motion.span
              className="text-primary"
              animate={{
                textShadow: [
                  '0 0 5px hsl(180, 100%, 50%)',
                  '0 0 15px hsl(180, 100%, 50%)',
                  '0 0 5px hsl(180, 100%, 50%)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Khách hàng
            </motion.span>
          </h2>
          <p className="text-muted-foreground">
            Tổng hợp reviews từ Google và Facebook
          </p>
        </motion.div>

        {/* ===== Stats ===== */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            variants={itemVariants} 
            className="glass-panel p-4 text-center"
            role="status"
            aria-label={`Average rating: ${stats.averageRating} stars`}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-5 h-5 fill-accent text-accent" />
              <span className="text-2xl font-display font-bold text-foreground">
                {stats.averageRating}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Điểm trung bình</p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="glass-panel p-4 text-center"
            role="status"
            aria-label={`Total reviews: ${stats.totalReviews}`}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-2xl font-display font-bold text-foreground">
                {stats.totalReviews}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Tổng đánh giá</p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="glass-panel p-4 text-center"
            role="status"
            aria-label={`Google reviews: ${stats.googleReviews}`}
          >
            <span className="text-2xl font-display font-bold text-blue-400">
              {stats.googleReviews}
            </span>
            <p className="text-xs text-muted-foreground">Google Reviews</p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="glass-panel p-4 text-center"
            role="status"
            aria-label={`Facebook reviews: ${stats.facebookReviews}`}
          >
            <span className="text-2xl font-display font-bold text-indigo-400">
              {stats.facebookReviews}
            </span>
            <p className="text-xs text-muted-foreground">Facebook Reviews</p>
          </motion.div>
        </motion.div>

        {/* ===== Reviews Grid ===== */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          role="list"
          aria-label="Customer reviews list"
        >
          {reviews.map(review => (
            <motion.div 
              key={review.id} 
              variants={itemVariants}
              role="listitem"
            >
              <ReviewCard
                name={review.fullname}
                avatar={review.avatar}
                rating={review.rating}
                review={review.review}
                source={review.source}
                date={review.date}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};