import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, Filter, Search, ShoppingBag, LogOut } from 'lucide-react';
import { NavigationTabs } from '@/components/NavigationTabs'; // THÊM MỚI
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import yamaha_dtx532k from '../images/Yamaha DTX532K.webp';
import alesis_nitro from '../images/Alesis Nitro.webp'
import td_17kvx from '../images/TD-27KV.webp';
import alesis_strike_pro from '../images/Alesis Strike Pro.webp';
import dtx6k3 from '../images/DTX6K3-X.jpg';
const drumProducts = [
  {
    id: 1,
    name: "Roland TD-17KVX",
    price: "32,900,000",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400",
    rating: 4.8,
    reviews: 127,
    brand: "Roland",
    type: "Electronic Drum Kit",
    features: ["Mesh heads", "Bluetooth", "TD-17 Module"],
    description: "Bộ trống điện tử cao cấp với đầu mesh cho cảm giác chơi tự nhiên"
  },
  {
    id: 2,
    name: "Yamaha DTX6K3-X",
    price: "45,500,000",
    image: dtx6k3,
    rating: 4.9,
    reviews: 89,
    brand: "Yamaha",
    type: "Electronic Drum Kit",
    features: ["DTX-PRO Module", "TCS Heads", "Premium Quality"],
    description: "Trống điện tử chuyên nghiệp với công nghệ TCS tiên tiến"
  },
  {
    id: 3,
    name: "Alesis Nitro Mesh Kit",
    price: "12,900,000",
    image: alesis_nitro,
    rating: 4.5,
    reviews: 256,
    brand: "Alesis",
    type: "Electronic Drum Kit",
    features: ["All Mesh Heads", "Nitro Module", "Budget Friendly"],
    description: "Lựa chọn tốt nhất cho người mới bắt đầu với giá cả phải chăng"
  },
  {
    id: 4,
    name: "Roland TD-27KV",
    price: "68,900,000",
    image: td_17kvx,
    rating: 4.9,
    reviews: 54,
    brand: "Roland",
    type: "Professional Kit",
    features: ["TD-27 Module", "Digital Pads", "Pro Performance"],
    description: "Bộ trống chuyên nghiệp dành cho biểu diễn và thu âm"
  },
  {
    id: 5,
    name: "Yamaha DTX532K",
    price: "28,500,000",
    image: yamaha_dtx532k,
    rating: 4.6,
    reviews: 143,
    brand: "Yamaha",
    type: "Electronic Drum Kit",
    features: ["DTX532 Module", "TP70S Pads", "Great Value"],
    description: "Cân bằng hoàn hảo giữa chất lượng và giá cả"
  },
  {
    id: 6,
    name: "Alesis Command Mesh Kit",
    price: "18,900,000",
    image: "https://images.unsplash.com/photo-1519508234439-4f23643125c1?w=400",
    rating: 4.7,
    reviews: 198,
    brand: "Alesis",
    type: "Electronic Drum Kit",
    features: ["Command Module", "Mesh Heads", "70+ Kits"],
    description: "Nhiều âm thanh đa dạng với hơn 70 bộ kit sẵn có"
  },
  {
    id: 7,
    name: "Roland TD-50KV2",
    price: "125,000,000",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400",
    rating: 5.0,
    reviews: 32,
    brand: "Roland",
    type: "Flagship Kit",
    features: ["TD-50X Module", "Digital Snare", "Studio Grade"],
    description: "Đỉnh cao công nghệ trống điện tử, dành cho studio chuyên nghiệp"
  },
  {
    id: 8,
    name: "Yamaha DTX402K",
    price: "16,500,000",
    image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=400",
    rating: 4.4,
    reviews: 287,
    brand: "Yamaha",
    type: "Entry Level Kit",
    features: ["DTX402 Module", "Compact Design", "Training Functions"],
    description: "Bộ trống nhỏ gọn phù hợp cho căn hộ và người mới học"
  },
  {
    id: 9,
    name: "Alesis Strike Pro SE",
    price: "89,900,000",
    image: alesis_strike_pro,
    rating: 4.8,
    reviews: 76,
    brand: "Alesis",
    type: "Professional Kit",
    features: ["Strike Module", "Mesh Heads", "5-Year Warranty"],
    description: "Chất lượng cao cấp với giá cạnh tranh hơn Roland và Yamaha"
  }
];

const ProductCard = ({ product }: { product: typeof drumProducts[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="glass-panel overflow-hidden hover:border-primary transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
          {product.brand}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{product.type}</p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.rating}</span>
          </div>
          <span className="text-muted-foreground text-sm">({product.reviews} đánh giá)</span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.features.map((feature, idx) => (
            <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground">
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="text-xs text-muted-foreground">Giá tham khảo</div>
            <div className="text-xl font-bold text-primary">{product.price}₫</div>
          </div>
          <Button size="sm" className="gap-2">
            Chi tiết
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const brands = ['all', ...new Set(drumProducts.map(p => p.brand))];

  const priceRanges = [
    { value: 'all', label: 'Tất cả mức giá' },
    { value: 'under20', label: 'Dưới 20 triệu' },
    { value: '20to50', label: '20-50 triệu' },
    { value: '50to100', label: '50-100 triệu' },
    { value: 'over100', label: 'Trên 100 triệu' }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
  };

  const filteredProducts = drumProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;

    const price = parseInt(product.price.replace(/,/g, ''));
    let matchesPrice = true;
    if (priceRange === 'under20') matchesPrice = price < 20000000;
    else if (priceRange === '20to50') matchesPrice = price >= 20000000 && price < 50000000;
    else if (priceRange === '50to100') matchesPrice = price >= 50000000 && price < 100000000;
    else if (priceRange === 'over100') matchesPrice = price >= 100000000;

    return matchesSearch && matchesBrand && matchesPrice;
  });

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
        <motion.div
          className="flex items-center justify-center gap-3 mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <ShoppingBag className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-wider">
            <span className="text-primary">KHÁM PHÁ</span>
            <span className="text-foreground ml-2">SẢN PHẨM</span>
          </h1>
        </motion.div>
        <motion.p
          className="text-muted-foreground mt-2 text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Tìm hiểu giá và thông tin các bộ trống điện tử hàng đầu
        </motion.p>
      </motion.header>

      {/* Shop Section */}
      <main className="flex-1 px-4 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Filters */}
            <div className="glass-panel mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative min-w-[200px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 bg-background border border-border rounded-lg focus:border-primary focus:outline-none appearance-none cursor-pointer transition-colors"
                  >
                    <option value="all">Tất cả thương hiệu</option>
                    {brands.filter(b => b !== 'all').map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div className="relative min-w-[200px]">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:outline-none appearance-none cursor-pointer transition-colors"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Summary */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tìm thấy <span className="font-bold text-foreground">{filteredProducts.length}</span> sản phẩm
                  </span>
                  {(searchTerm || selectedBrand !== 'all' || priceRange !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedBrand('all');
                        setPriceRange('all');
                      }}
                      className="text-primary hover:underline"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="glass-panel text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-muted-foreground mb-4">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedBrand('all');
                    setPriceRange('all');
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

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

export default Shop;