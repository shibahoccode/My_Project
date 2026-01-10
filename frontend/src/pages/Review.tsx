// src/pages/Review.tsx
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Send, Facebook, Chrome, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ReviewData {
  reviewPlatform: 'google' | 'facebook';
  reviewRating: number;
  reviewText: string;
}

interface ReviewResponse {
  reviewPlatform: string;
  reviewRating: number;
  reviewText: string;
  reviewDate: string;
  username?: string;
}

// ============================================================================
// API SERVICE WITH DEBUG
// ============================================================================

const API_BASE_URL = 'http://localhost:8080/api/review';

const submitReviewAPI = async (token: string, reviewData: ReviewData): Promise<ReviewResponse> => {
  console.log('=== SUBMIT REVIEW API CALL START ===');
  console.log('1. API URL:', `${API_BASE_URL}/submit`);
  console.log('2. Token length:', token.length);
  console.log('3. Token (first 50 chars):', token.substring(0, 50) + '...');
  console.log('4. Review Data:', reviewData);

  try {
    console.log('5. Sending fetch request...');
    const response = await fetch(`${API_BASE_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });

    console.log('6. ✅ Fetch completed');
    console.log('7. Response Status:', response.status);
    console.log('8. Response OK?', response.ok);

    if (!response.ok) {
      console.error('9. ❌ Response not OK, reading error...');
      const errorText = await response.text();
      console.error('10. Error Response Text:', errorText);

      try {
        const errorJson = JSON.parse(errorText);
        console.error('11. Error JSON parsed:', errorJson);

        if (response.status === 401 || response.status === 403) {
          console.error('12. 🔑 Auth error detected - throwing TOKEN_EXPIRED');
          throw new Error('TOKEN_EXPIRED');
        }

        console.error('13. ⚠️ Other error - throwing message:', errorJson.message);
        throw new Error(errorJson.message || 'Có lỗi xảy ra');
      } catch (parseError) {
        console.error('14. ❌ Failed to parse error JSON');
        if (response.status === 401 || response.status === 403) {
          console.error('15. 🔑 Auth error (unparseable) - throwing TOKEN_EXPIRED');
          throw new Error('TOKEN_EXPIRED');
        }
        console.error('16. ⚠️ Throwing raw error text');
        throw new Error(errorText || 'Có lỗi xảy ra');
      }
    }

    console.log('17. ✅ Response OK, parsing JSON...');
    const data = await response.json();
    console.log('18. ✅ Success Response:', data);
    console.log('=== SUBMIT REVIEW API CALL END - SUCCESS ===');
    return data;

  } catch (error) {
    console.error('=== ERROR IN SUBMIT API ===');
    console.error('Error type:', error instanceof Error ? 'Error' : typeof error);
    console.error('Error object:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.error('=== SUBMIT REVIEW API CALL END - ERROR ===');
    throw error;
  }
};

const fetchUserReviewAPI = async (token: string): Promise<ReviewResponse | null> => {
  console.log('=== FETCH REVIEW DEBUG START ===');
  console.log('1. API URL:', `${API_BASE_URL}/get`);

  try {
    const response = await fetch(`${API_BASE_URL}/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('2. Response Status:', response.status);

    if (response.status === 404) {
      console.log('3. No review found (404 - normal)');
      return null;
    }

    if (response.status === 401 || response.status === 403) {
      console.error('4. Auth error:', response.status);
      throw new Error('TOKEN_EXPIRED');
    }

    if (!response.ok) {
      console.error('5. Other error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('6. Review found:', data);
    console.log('=== FETCH REVIEW DEBUG END ===');
    return data;

  } catch (error) {
    console.error('=== ERROR IN FETCH ===', error);
    if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
      throw error;
    }
    return null;
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Review() {
  // Sử dụng useAuth hook giống Auth.tsx
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [platform, setPlatform] = useState<'google' | 'facebook' | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const hasLoadedReview = useRef(false);

  // ============================================================================
  // CHECK AUTHENTICATION - Giống Auth.tsx
  // ============================================================================

  useEffect(() => {
    console.log('=== AUTHENTICATION CHECK ===');
    console.log('1. Loading state:', loading);
    console.log('2. User object:', user);
    console.log('3. User exists:', !!user);
    console.log('4. User has token:', !!user?.token);
    console.log('5. Token value:', user?.token ? `${user.token.substring(0, 30)}...` : 'null');

    // ✅ CHỈ redirect khi ĐÃ LOAD XONG và KHÔNG CÓ USER
    if (!loading && !user) {
      console.log('6. ❌ Not loading + No user → Redirecting to login');
      navigate('/auth?mode=login');
      return;
    }

    // ✅ Nếu đang loading, không làm gì cả
    if (loading) {
      console.log('7. ⏳ Still loading, waiting...');
      setDebugInfo('⏳ Đang kiểm tra đăng nhập...');
      return;
    }

    // ✅ Nếu có user và có token
    if (user && user.token) {
      console.log('8. ✅ User authenticated:', user.username);
      console.log('9. ✅ Token length:', user.token.length);
      setDebugInfo(`✅ Đã đăng nhập: ${user.username} | Token: ${user.token.substring(0, 20)}...`);
      return;
    }

    // ✅ Nếu có user NHƯNG KHÔNG CÓ token (không nên xảy ra)
    if (user && !user.token) {
      console.error('10. ⚠️ CRITICAL: User exists but NO TOKEN!');
      console.error('11. This should never happen - data inconsistency');
      console.error('12. User data:', user);
      setDebugInfo('⚠️ Lỗi: User không có token - đang logout');

      // Clear localStorage và logout
      localStorage.clear();
      logout?.();
      navigate('/auth?mode=login');
    }
  }, [user, loading, navigate, logout]);

  // ============================================================================
  // LOAD EXISTING REVIEW
  // ============================================================================

  useEffect(() => {
    const loadExistingReview = async () => {
      if (hasLoadedReview.current || !user?.token || loading) {
        return;
      }

      hasLoadedReview.current = true;
      setIsLoadingReview(true);

      try {
        console.log('🔍 Fetching existing review...');
        const existingReview = await fetchUserReviewAPI(user.token);

        if (existingReview) {
          console.log('✅ Review found:', existingReview);

          const normalizedPlatform = existingReview.reviewPlatform.toLowerCase();
          if (normalizedPlatform === 'google' || normalizedPlatform === 'facebook') {
            setPlatform(normalizedPlatform);
          }

          setRating(existingReview.reviewRating);
          setReviewText(existingReview.reviewText);
          setDebugInfo('✅ Đã tải review cũ thành công');

          toast({
            title: "Đã tải đánh giá của bạn",
            description: "Bạn có thể chỉnh sửa và gửi lại"
          });
        } else {
          console.log('ℹ️ No existing review found');
          setDebugInfo('ℹ️ Chưa có review');
        }
      } catch (error) {
        console.error('❌ Error loading review:', error);

        if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
          setDebugInfo('❌ Token đã hết hạn');
          toast({
            title: "Phiên đăng nhập hết hạn",
            description: "Vui lòng đăng nhập lại",
            variant: "destructive"
          });
          logout?.();
          navigate('/auth?mode=login');
        }
      } finally {
        setIsLoadingReview(false);
      }
    };

    if (user?.token && !loading && !hasLoadedReview.current) {
      loadExistingReview();
    }
  }, [user, loading, navigate, logout, toast]);

  // ============================================================================
  // FORM VALIDATION
  // ============================================================================

  const validateForm = (): boolean => {
    if (!platform) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn nền tảng đánh giá",
        variant: "destructive"
      });
      return false;
    }

    if (rating === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn số sao đánh giá",
        variant: "destructive"
      });
      return false;
    }

    const trimmedText = reviewText.trim();
    if (!trimmedText) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung đánh giá",
        variant: "destructive"
      });
      return false;
    }

    if (trimmedText.length > 500) {
      toast({
        title: "Lỗi",
        description: "Đánh giá không được vượt quá 500 ký tự",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // ============================================================================
  // SUBMIT HANDLER
  // ============================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== FORM SUBMIT ===');
    console.log('Platform:', platform);
    console.log('Rating:', rating);
    console.log('Text length:', reviewText.trim().length);
    console.log('User token exists:', !!user?.token);

    if (!validateForm() || !user?.token || !platform) {
      console.log('❌ Validation failed or missing token');
      return;
    }

    setIsSubmitting(true);
    setDebugInfo('⏳ Đang gửi đánh giá...');

    try {
      const reviewData: ReviewData = {
        reviewPlatform: platform,
        reviewRating: rating,
        reviewText: reviewText.trim(),
      };

      console.log('📤 Calling submitReviewAPI...');
      await submitReviewAPI(user.token, reviewData);

      console.log('✅ Submit successful!');
      setShowSuccess(true);
      setDebugInfo('✅ Đánh giá đã được gửi thành công!');

      toast({
        title: "Cảm ơn bạn đã đánh giá! ⭐",
        description: `Đánh giá ${rating} sao của bạn trên ${platform === 'google' ? 'Google' : 'Facebook'} đã được lưu thành công.`
      });

      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('❌ Submit error:', error);

      if (error instanceof Error) {
        console.error('Error message:', error.message);

        // ✅ CHỈ logout nếu THỰC SỰ là token expired
        if (error.message === 'TOKEN_EXPIRED') {
          console.error('🔑 Token expired - logging out');
          setDebugInfo('❌ Token hết hạn, đang logout...');
          toast({
            title: "Phiên đăng nhập hết hạn",
            description: "Vui lòng đăng nhập lại",
            variant: "destructive"
          });
          logout?.();
          navigate('/auth?mode=login');
        } else {
          // ✅ CÁC LỖI KHÁC: Chỉ hiển thị thông báo, KHÔNG logout
          console.error('⚠️ Other error (not token related):', error.message);
          setDebugInfo(`❌ Lỗi: ${error.message}`);
          toast({
            title: "Lỗi khi gửi đánh giá",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        console.error('⚠️ Unknown error type');
        setDebugInfo('❌ Lỗi không xác định');
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra, vui lòng thử lại",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
      console.log('=== FORM SUBMIT END ===');
    }
  };

  // ============================================================================
  // TEST CONNECTION BUTTON
  // ============================================================================

  const testConnection = async () => {
    if (!user?.token) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy token",
        variant: "destructive"
      });
      return;
    }

    console.log('=== TEST CONNECTION ===');
    setDebugInfo('⏳ Testing connection...');

    try {
      const response = await fetch(`${API_BASE_URL}/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      console.log('Test response status:', response.status);

      if (response.status === 404) {
        setDebugInfo('✅ Kết nối OK! (404 = chưa có review)');
        toast({
          title: "Kết nối thành công",
          description: "Backend hoạt động bình thường"
        });
      } else if (response.status === 200) {
        setDebugInfo('✅ Kết nối OK! (200 = có review)');
        toast({
          title: "Kết nối thành công",
          description: "Backend hoạt động bình thường"
        });
      } else if (response.status === 401 || response.status === 403) {
        setDebugInfo('❌ Token không hợp lệ hoặc đã hết hạn!');
        toast({
          title: "Lỗi xác thực",
          description: "Token không hợp lệ",
          variant: "destructive"
        });
      } else {
        setDebugInfo(`⚠️ Response status: ${response.status}`);
        toast({
          title: "Cảnh báo",
          description: `Response status: ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setDebugInfo('❌ Không thể kết nối đến server!');
      toast({
        title: "Lỗi kết nối",
        description: "Không thể kết nối đến backend. Hãy kiểm tra xem backend có đang chạy không.",
        variant: "destructive"
      });
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const trimmedLength = reviewText.trim().length;
  const hasWhitespace = reviewText.length !== trimmedLength;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-slate-300">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null; // useEffect sẽ redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <div className="mb-4">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting || isLoadingReview}
              onClick={() => navigate(-1)}
              className="text-slate-300 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Đánh Giá Của Bạn
          </h1>
          <p className="text-slate-300 text-lg">
            Chia sẻ trải nghiệm của bạn với chúng tôi
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Đăng nhập với tài khoản: <span className="text-purple-400 font-semibold">{user.username}</span>
          </p>
          {isLoadingReview && (
            <p className="text-slate-500 text-xs mt-2 flex items-center justify-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Đang tải đánh giá của bạn...
            </p>
          )}
        </motion.div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            className="mb-6 bg-green-500/20 border border-green-500 rounded-xl p-4 flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-green-400 font-semibold">Cảm ơn bạn đã đánh giá! ⭐</p>
              <p className="text-green-300 text-sm">
                Đánh giá {rating} sao của bạn trên {platform === 'google' ? 'Google' : 'Facebook'} đã được lưu thành công.
              </p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >

          {/* Platform Selection */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-lg">
              Chọn nền tảng đánh giá
            </label>
            <div className="grid grid-cols-2 gap-4">

              <motion.button
                type="button"
                onClick={() => setPlatform('google')}
                disabled={isLoadingReview || isSubmitting}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300
                  flex flex-col items-center gap-3
                  ${platform === 'google'
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/50'
                    : 'border-slate-600 bg-slate-700/50 hover:border-blue-400'
                  }
                  ${(isLoadingReview || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                whileHover={!isLoadingReview && !isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isLoadingReview && !isSubmitting ? { scale: 0.95 } : {}}
              >
                <Chrome className="w-10 h-10 text-blue-400" />
                <span className="text-white font-semibold">Google</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setPlatform('facebook')}
                disabled={isLoadingReview || isSubmitting}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300
                  flex flex-col items-center gap-3
                  ${platform === 'facebook'
                    ? 'border-blue-600 bg-blue-600/20 shadow-lg shadow-blue-600/50'
                    : 'border-slate-600 bg-slate-700/50 hover:border-blue-500'
                  }
                  ${(isLoadingReview || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                whileHover={!isLoadingReview && !isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isLoadingReview && !isSubmitting ? { scale: 0.95 } : {}}
              >
                <Facebook className="w-10 h-10 text-blue-500" />
                <span className="text-white font-semibold">Facebook</span>
              </motion.button>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-lg">
              Đánh giá số sao
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={isLoadingReview || isSubmitting}
                  className="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isLoadingReview && !isSubmitting ? { scale: 1.2 } : {}}
                  whileTap={!isLoadingReview && !isSubmitting ? { scale: 0.9 } : {}}
                >
                  <Star
                    className={`w-12 h-12 transition-all duration-200 ${star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-600 hover:text-slate-500'
                      }`}
                  />
                </motion.button>
              ))}
            </div>
            {rating > 0 && (
              <motion.p
                className="text-center mt-3 text-yellow-400 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {rating === 5 && "Tuyệt vời! ⭐⭐⭐⭐⭐"}
                {rating === 4 && "Rất tốt! ⭐⭐⭐⭐"}
                {rating === 3 && "Khá ổn! ⭐⭐⭐"}
                {rating === 2 && "Tạm được ⭐⭐"}
                {rating === 1 && "Cần cải thiện ⭐"}
              </motion.p>
            )}
          </div>

          {/* Review Text */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-lg">
              Nhập đánh giá của bạn
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={isLoadingReview || isSubmitting}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm/dịch vụ..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between items-center mt-2">
              <p className={`text-sm ${trimmedLength > 500 ? 'text-red-400 font-semibold' :
                  trimmedLength > 450 ? 'text-yellow-400' : 'text-slate-400'
                }`}>
                {trimmedLength}/500 ký tự
              </p>
              {hasWhitespace && (
                <p className="text-xs text-slate-500">
                  (Có khoảng trắng thừa)
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isLoadingReview}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                <span>Gửi đánh giá</span>
              </>
            )}
          </Button>
        </motion.form>

        {/* Footer Info */}
        <motion.div
          className="mt-6 text-center text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn 💜</p>
        </motion.div>
      </div>
    </div>
  );
}