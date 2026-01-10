import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Music, Mail, Lock, User, Loader2, Drum, ArrowLeft, Eye, EyeOff, UserCircle } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  
  // State quản lý form - Sử dụng fullName
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !loading) {
      navigate('/play');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'register');
    // Reset form khi chuyển mode
    setFormData({ 
      username: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
      fullName: '' 
    });
  }, [searchParams]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate form - Thêm validation cho fullName
  const validateForm = () => {
    if (!formData.username || !formData.password) {
      toast({ title: "Lỗi", description: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return false;
    }

    if (!isLogin) {
      if (!formData.fullName || formData.fullName.trim().length === 0) {
        toast({ title: "Lỗi", description: "Vui lòng nhập họ và tên", variant: "destructive" });
        return false;
      }

      if (!formData.email) {
        toast({ title: "Lỗi", description: "Vui lòng nhập email", variant: "destructive" });
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({ title: "Lỗi", description: "Email không hợp lệ", variant: "destructive" });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Lỗi", description: "Mật khẩu xác nhận không khớp", variant: "destructive" });
        return false;
      }

      if (formData.password.length < 6) {
        toast({ title: "Lỗi", description: "Mật khẩu phải có ít nhất 6 ký tự", variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Login bằng username + password
        const { error } = await signIn(formData.username, formData.password);
        if (error) {
          toast({ title: "Đăng nhập thất bại", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Thành công", description: `Chào mừng ${formData.username}!` });
        }
      } else {
        // Register bằng username + email + password + fullName
        const { error } = await signUp(
          formData.username, 
          formData.email, 
          formData.password,
          formData.fullName
        );
        if (error) {
          toast({ title: "Đăng ký thất bại", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Thành công", description: "Đăng ký thành công! Vui lòng đăng nhập." });
          setIsLogin(true); // Chuyển sang login
          setFormData({ 
            username: '', 
            email: '', 
            password: '', 
            confirmPassword: '', 
            fullName: '' 
          });
        }
      }
    } catch (err) {
      toast({ title: "Lỗi", description: "Có lỗi xảy ra, vui lòng thử lại", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* Background Animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-primary/10 blur-3xl" animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-purple-500/10 blur-3xl" animate={{ x: [0, -100, 0], y: [0, -50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <motion.div className="w-full max-w-md relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span>Quay lại</span>
        </motion.button>

        <motion.div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Drum className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold">
            <span className="text-primary">DRUM</span><span className="text-foreground ml-2">MACHINE</span>
          </h1>
        </motion.div>

        {/* Auth Tabs */}
        <div className="flex mb-6 bg-muted/50 rounded-lg p-1">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>Đăng nhập</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${!isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>Đăng ký</button>
        </div>

        {/* Form */}
        <motion.div className="glass-panel p-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <AnimatePresence mode="wait">
            <motion.div key={isLogin ? 'login' : 'signup'} initial={{ opacity: 0, x: isLogin ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isLogin ? 20 : -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold mb-2 text-foreground">{isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                
                {/* Full Name - Chỉ hiện khi Đăng ký */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        placeholder="Nguyễn Văn A" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        className="pl-10 h-12" 
                      />
                    </div>
                  </div>
                )}

                {/* Username Input - Luôn hiện */}
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="username" name="username" placeholder="Nhập tên đăng nhập" value={formData.username} onChange={handleChange} className="pl-10 h-12" />
                  </div>
                </div>

                {/* Email Input - Chỉ hiện khi Đăng ký */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} className="pl-10 h-12" />
                    </div>
                  </div>
                )}

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={handleChange} className="pl-10 h-12 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input - Chỉ hiện khi Đăng ký */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={formData.confirmPassword} onChange={handleChange} className="pl-10 h-12" />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full h-12 bg-primary mt-4" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : (isLogin ? <User className="w-5 h-5 mr-2" /> : <Music className="w-5 h-5 mr-2" />)}
                  {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                </Button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-2 text-primary font-semibold hover:underline">
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;