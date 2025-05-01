import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// Import semua ikon sekaligus
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch, FaStore, FaRegHeart, 
         FaHeart, FaWallet, FaPlus, FaBell, FaFire, FaStar, FaGift, FaMagic } from 'react-icons/fa'

// Import gambar di bagian atas file
import iphone from '../assets/iphone.jpg'
import laptop from '../assets/Laptop.png'
import headphones from '../assets/headphones.jpg'
import programmingBook from '../assets/Programming_Book.png'
import manga from '../assets/manga.jpg'
import appleWatch from '../assets/applewatch.png'
import noImage from '../assets/no-image.png'

// Data contoh untuk toko
const sampleStores = [
  {
    id: '1',
    name: 'Tech Store',
    address: '123 Tech Street'
  },
  {
    id: '2',
    name: 'Book Haven',
    address: '456 Library Lane'
  }
];

// Mapping produk ke gambar
const productImageMap = {
  'Smartphone': iphone,
  'Laptop': laptop,
  'Wireless Headphones': headphones,
  'Programming Book': programmingBook,
  'Comic Book Collection': manga,
  'Apple Watch': appleWatch,
};

// Data contoh produk
const sampleProducts = [
  // Tech Store
  {
    id: '1',
    name: 'Smartphone',
    price: 700.00,
    stock: 8,
    image_url: iphone,
    store_id: '1'
  },
  {
    id: '2',
    name: 'Laptop',
    price: 900.00,
    stock: 8,
    image_url: laptop,
    store_id: '1'
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    price: 120.00,
    stock: 17,
    image_url: headphones,
    store_id: '1'
  },
  // Book Haven
  {
    id: '4',
    name: 'Programming Book',
    price: 40.00,
    stock: 49,
    image_url: programmingBook,
    store_id: '2'
  },
  {
    id: '5',
    name: 'Comic Book Collection',
    price: 25.00,
    stock: 29,
    image_url: manga,
    store_id: '2'
  }
];

const ProductList = ({ setIsAuthenticated }) => {
  // State variables
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStore, setSelectedStore] = useState('')
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [sortBy, setSortBy] = useState('default')
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [featuredProduct, setFeaturedProduct] = useState(null)
  const [animateItems, setAnimateItems] = useState(false)
  const [showPromo, setShowPromo] = useState(true)
  const [bgAnimation, setBgAnimation] = useState(0)
  const [showMobileNotifications, setShowMobileNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  // Tema warna
  const primaryGradient = 'from-purple-600 to-blue-500'
  const secondaryColor = 'bg-white'
  const accentColor = 'bg-purple-600 hover:bg-purple-700'
  const textColor = 'text-purple-600'
  const lightBgGradient = 'from-blue-50 to-purple-50'
  
  // Effect untuk memuat data awal
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Fetch products and stores
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch stores
        const storeResponse = await axios.get('http://localhost:3000/store/getAll')
        let filteredStores = []
        
        if (storeResponse.data.success) {
          // Filter hanya Tech Store dan Book Haven
          filteredStores = storeResponse.data.payload.filter(
            store => store.name === 'Tech Store' || store.name === 'Book Haven'
          )
          
          if (filteredStores.length === 0) {
            filteredStores = sampleStores
          }
          
          setStores(filteredStores)
        } else {
          setStores(sampleStores)
        }
        
        // Dapatkan ID toko
        const storeIds = filteredStores.map(store => store.id)
        
        // Fetch produk
        const productResponse = await axios.get('http://localhost:3000/item')
        if (productResponse.data.success) {
          const filteredProducts = productResponse.data.payload.filter(
            product => storeIds.includes(product.store_id)
          ).map(product => ({ ...product }))
          
          if (filteredProducts.length === 0) {
            setProducts(sampleProducts)
            setFeaturedProduct(sampleProducts[Math.floor(Math.random() * sampleProducts.length)])
          } else {
            setProducts(filteredProducts)
            setFeaturedProduct(filteredProducts[Math.floor(Math.random() * filteredProducts.length)])
          }
        } else {
          setProducts(sampleProducts)
          setFeaturedProduct(sampleProducts[Math.floor(Math.random() * sampleProducts.length)])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setProducts(sampleProducts)
        setStores(sampleStores)
        setFeaturedProduct(sampleProducts[Math.floor(Math.random() * sampleProducts.length)])
      } finally {
        setLoading(false)
        setTimeout(() => setAnimateItems(true), 500)
      }
    }
    
    fetchData()
    setNotifications([])
    
    // Konfeti efek
    setTimeout(() => {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }, 1000)
    
    // Background animation
    const bgInterval = setInterval(() => {
      setBgAnimation(prev => (prev + 1) % 100)
    }, 50)
    
    return () => clearInterval(bgInterval)
  }, [])

  // Fungsi untuk top up saldo
  const handleTopUp = async () => {
    if (topUpAmount <= 0) {
      alert('Silakan masukkan jumlah yang valid');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/user/topUp', {
        id: user.id,
        amount: parseInt(topUpAmount)
      });
      
      if (response.data.success) {
        const updatedUser = response.data.payload.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setIsTopUpModalOpen(false);
        setTopUpAmount(0);
        alert('Top up berhasil!');
      } else {
        alert('Gagal melakukan top up: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error saat top up:', error);
      alert('Gagal melakukan top up. Silakan coba lagi.');
    }
  }

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    navigate('/')
  }

  // Fungsi menambah item ke keranjang
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity + 1 > product.stock) {
        alert(`Maaf, stok untuk ${product.name} tidak cukup. Tersisa ${product.stock} item.`)
        return
      }
      
      setCart(cart.map(item => 
        item.id === product.id 
          ? {...item, quantity: item.quantity + 1} 
          : item
      ))
    } else {
      if (product.stock <= 0) {
        alert(`Maaf, ${product.name} sudah habis.`)
        return
      }
      
      setCart([...cart, {...product, quantity: 1}])
    }
  }

  // Fungsi menghapus item dari keranjang
  const removeFromCart = (productId) => {
    const existingItem = cart.find(item => item.id === productId)
    
    if (existingItem.quantity === 1) {
      setCart(cart.filter(item => item.id !== productId))
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? {...item, quantity: item.quantity - 1} 
          : item
      ))
    }
  }

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  // Filter dan urutkan produk
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStore = selectedStore ? product.store_id === selectedStore : true
    return matchesSearch && matchesStore
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
    return 0
  })

  // Total keranjang
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  // Fungsi checkout
  const checkout = async () => {
    if (cart.length === 0) return
    
    if (user.balance < cartTotal) {
      alert('Saldo tidak cukup. Silakan top up akun Anda.')
      setIsTopUpModalOpen(true)
      return
    }
    
    try {
      for (const item of cart) {
        await axios.post('http://localhost:3000/transaction/create', {
          user_id: user.id,
          item_id: item.id,
          quantity: item.quantity
        });
        
        await axios.put('http://localhost:3000/item/updateStock', {
          id: item.id,
          quantity: item.quantity
        });
      }
      
      const updatedBalance = user.balance - cartTotal;
      await axios.post('http://localhost:3000/user/updateBalance', {
        id: user.id,
        amount: -cartTotal
      });
      
      const updatedUser = { ...user, balance: updatedBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      const productResponse = await axios.get('http://localhost:3000/item');
      if (productResponse.data.success) {
        const storeIds = stores.map(store => store.id);
        const filteredProducts = productResponse.data.payload.filter(
          product => storeIds.includes(product.store_id)
        );
        
        setProducts(filteredProducts);
      }
      
      setCart([]);
      setIsCartOpen(false);
      
      setNotifications([
        { 
          id: Date.now(), 
          text: `Pembelian berhasil! Total: $${cartTotal.toFixed(2)}`, 
          time: 'Baru saja' 
        },
        ...notifications
      ]);
      
      alert('Checkout berhasil! Pesanan Anda telah dibuat.');
    } catch (error) {
      console.error('Error saat checkout:', error);
      alert('Checkout gagal. Silakan coba lagi.');
    }
  }

  // Mendapatkan URL gambar
  const getImageUrl = (imageUrl, productName) => {
    if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    if (productName && productImageMap[productName]) {
      return productImageMap[productName];
    }
    
    return noImage;
  };

  // Mendapatkan nama toko berdasarkan ID
  const getStoreNameById = (id) => {
    const store = stores.find(store => store.id === id)
    return store ? store.name : 'Unknown Store'
  }

  // Format saldo
  const formatBalance = (balance) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(balance)
  }

  // Efek konfeti
  const renderConfetti = () => {
    const particles = []
    const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93']
    
    for (let i = 0; i < 60; i++) {
      const left = Math.floor(Math.random() * 100)
      const width = Math.floor(Math.random() * 8) + 4
      const delay = Math.random() * 3
      const duration = Math.random() * 3 + 3
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      particles.push(
        <motion.div
          key={i}
          className="fixed rounded-md z-40 pointer-events-none"
          style={{ 
            left: `${left}%`, 
            top: -20, 
            width, 
            height: width * 1.5,
            backgroundColor: color 
          }}
          initial={{ y: -20, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 50,
            rotate: Math.random() * 360,
            opacity: [1, 1, 0.5, 0]
          }}
          transition={{ 
            duration,
            delay,
            ease: "easeInOut"
          }}
        />
      )
    }
    
    return particles
  }
  
  // Ganti fungsi renderWaves lama dengan ini
  const renderWaves = () => {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
      </div>
    )
  }

  // Tutup notifikasi saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-panel') && 
          !event.target.closest('.notification-button')) {
        setShowNotifications(false);
      }
      
      if (showMobileNotifications && !event.target.closest('.mobile-notification-panel') && 
          !event.target.closest('.mobile-notification-button')) {
        setShowMobileNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showMobileNotifications]);

  // CSS styles tambahan untuk container yang lebih estetik
  const useStyles = `
    @media (max-width: 640px) {
      .mobile-modal {
        width: 90% !important;
        max-width: 90% !important;
        margin: 0 auto;
      }
      
      .mobile-notification-panel {
        width: 90% !important;
        max-width: 90% !important;
        left: 5%;
        right: 5%;
      }
    }

    .wide-container {
      width: 90%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    @media (min-width: 1280px) {
      .product-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (min-width: 1536px) {
      .product-grid {
        grid-template-columns: repeat(5, 1fr);
      }
    }
    
    /* Styling tambahan untuk kartu produk */
    .product-card {
      transition: all 0.3s ease;
      border-radius: 1rem;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(125, 46, 239, 0.1);
    }
    
    .product-img-container {
      height: 220px;
      overflow: hidden;
      position: relative;
      background: #f9f9f9;
    }
    
    .product-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.5s ease;
    }
    
    .product-card:hover .product-img {
      transform: scale(1.05);
    }
    
    .product-info {
      padding: 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .product-name {
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      line-height: 1.3;
      color: #1a202c;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .store-badge {
      display: inline-flex;
      align-items: center;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      background-color: rgba(124, 58, 237, 0.1);
      color: rgb(124, 58, 237);
      margin-bottom: 0.75rem;
      max-width: fit-content;
    }
    
    .price {
      font-weight: 700;
      font-size: 1.25rem;
      color: rgb(124, 58, 237);
      margin-top: auto;
    }
    
    /* Styling untuk section header */
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      position: relative;
      padding-bottom: 0.75rem;
    }
    
    .section-title:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: linear-gradient(to right, rgb(124, 58, 237), rgb(99, 102, 241));
      border-radius: 3px;
    }
    
    /* Styling untuk kartu promo */
    .promo-card {
      background: linear-gradient(135deg, rgb(124, 58, 237), rgb(94, 114, 228));
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }
  `;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Style untuk layout lebar */}
      <style>{useStyles}</style>
      
      {/* Background dengan animasi - z-index rendah */}
      {renderWaves()}
      
      {/* Konfeti */}
      {showConfetti && renderConfetti()}
      
      {/* Header utama dengan z-index tinggi */}
      <div className="fixed top-0 left-0 right-0 z-30">
        {/* Header untuk desktop */}
        <header className="backdrop-blur-md bg-white/80 text-gray-800 shadow-lg border-b border-white/20 hidden md:block">
          <div className="wide-container mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Logo dan Search */}
              <div className="flex items-center justify-between">
                <motion.div 
                  className="text-2xl font-bold flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <FaMagic className="mr-2 text-purple-600" size={24} />
                  <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                    ShopEasy
                  </span>
                </motion.div>
                
                <div className="relative md:w-96 ml-10">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    className="pl-10 p-2.5 rounded-full w-full bg-gray-100 focus:bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Profile, Cart, Balance */}
              <div className="flex items-center space-x-6">
                {/* Balance */}
                <motion.div 
                  className="flex items-center bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FaWallet className="mr-2" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">Saldo Anda</span>
                    <motion.span 
                      className="font-bold"
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {formatBalance(user?.balance || 0)}
                    </motion.span>
                  </div>
                  <motion.button
                    className="ml-2 bg-white/20 rounded-full w-6 h-6 flex items-center justify-center hover:bg-white/30"
                    whileHover={{ rotate: 180 }}
                    onClick={() => setIsTopUpModalOpen(true)}
                  >
                    <FaPlus size={12} />
                  </motion.button>
                </motion.div>
                
                {/* Cart */}
                <motion.button
                  className="relative p-2 rounded-full hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <FaShoppingCart className="text-purple-600" size={20} />
                  {cart.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </motion.span>
                  )}
                </motion.button>

                {/* Notifications */}
                <motion.button
                  className="relative p-2 rounded-full hover:bg-gray-200 transition-all notification-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FaBell className="text-purple-600" size={20} />
                  {notifications.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {notifications.length}
                    </motion.span>
                  )}
                </motion.button>
                
                {/* Notifications dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      className="absolute right-20 top-16 w-80 bg-white rounded-xl shadow-xl overflow-hidden z-50 notification-panel"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white flex justify-between items-center">
                        <h3 className="font-bold">Notifikasi</h3>
                        <div className="flex gap-2">
                          {notifications.length > 0 && (
                            <button 
                              className="text-white/80 hover:text-white text-sm"
                              onClick={() => setNotifications([])}
                            >
                              Hapus semua
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            <FaBell className="mx-auto text-gray-300 text-3xl mb-3" />
                            <p className="font-medium">Tidak ada notifikasi</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className="p-4 border-b border-gray-100 hover:bg-gray-50"
                            >
                              <p className="text-gray-800 mb-1">{notification.text}</p>
                              <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* User Profile */}
                <div className="relative">
                  <motion.div 
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 p-2 px-4 rounded-full cursor-pointer transition-all"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white flex items-center justify-center">
                      {user?.name?.charAt(0)?.toUpperCase() || <FaUser size={14} />}
                    </div>
                    <span className="font-medium hidden md:block">{user?.name || 'Pengguna'}</span>
                    <motion.div 
                      animate={{ rotate: showProfileMenu ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-40"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="p-4 border-b border-gray-100">
                          <p className="text-sm text-gray-500">Masuk sebagai</p>
                          <p className="font-medium text-gray-800">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <motion.button 
                            className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 rounded-lg text-red-600"
                            onClick={handleLogout}
                            whileHover={{ x: 5 }}
                          >
                            <FaSignOutAlt /> Keluar
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Header untuk mobile */}
        <div className="md:hidden">
          {/* Logo dan Notifikasi */}
          <div className="bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-between p-3">
            <motion.div 
              className="text-xl font-bold flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <FaMagic className="mr-2 text-purple-600" size={20} /> 
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                ShopEasy
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)} 
                className="relative p-2 rounded-full hover:bg-gray-200 transition"
              >
                <FaShoppingCart className="text-purple-600" size={20} />
                {cart.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </motion.span>
                )}
              </button>
              
              <button 
                className="relative p-2 rounded-full hover:bg-gray-200 transition-colors mobile-notification-button"
                onClick={() => setShowMobileNotifications(!showMobileNotifications)}
              >
                <FaBell className="text-purple-600" size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center notification-badge">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Balance & User */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs opacity-80">Saldo Anda</span>
                <span className="text-xl font-bold">{formatBalance(user?.balance || 0)}</span>
              </div>
              <button 
                className="bg-white/20 px-4 py-2 rounded-full flex items-center text-sm font-medium hover:bg-white/30 transition-colors"
                onClick={() => setIsTopUpModalOpen(true)}
              >
                <FaPlus className="mr-1.5" /> Top Up
              </button>
            </div>

            <div className="flex justify-between mt-3 pt-3 border-t border-white/20 items-center">
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-white text-purple-600 flex items-center justify-center mr-2 shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || <FaUser size={14} />}
                </div>
                <span className="text-sm font-medium">{user?.name || 'Pengguna'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full flex items-center text-sm transition-colors"
              >
                <FaSignOutAlt className="mr-1" /> Keluar
              </button>
            </div>
          </div>
          
          {/* Search Bar Mobile */}
          <div className="bg-white p-2 shadow-md">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                className="pl-10 p-2 rounded-full w-full bg-gray-100 focus:bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer untuk header */}
      <div className="h-[190px] md:h-[60px]"></div>
      
      {/* Main content dengan z-index lebih tinggi */}
      <div className="relative z-10">
        {/* Banner Produk Unggulan */}
        {featuredProduct && showPromo && (
          <motion.div 
            className="promo-card wide-container mx-auto mt-6 mb-6 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <button 
                className="absolute top-0 right-0 bg-white/20 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/30 transition-colors"
                onClick={() => setShowPromo(false)}
              >
                ✕
              </button>
              <div className="flex flex-col md:flex-row items-center">
                <motion.div 
                  className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                >
                  <div className="relative h-52 w-52 p-4 bg-white/20 rounded-xl">
                    <img 
                      src={getImageUrl(featuredProduct.image_url, featuredProduct.name)} 
                      alt={featuredProduct.name} 
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute -top-5 -right-5 w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
                      <div className="text-center">
                        <div className="text-xs font-bold">HEMAT</div>
                        <div className="text-xl font-black">20%</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <div className="w-full md:w-2/3 md:pl-10">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/30 text-white mb-3">
                    <FaFire className="text-yellow-300 mr-2" />
                    <span className="text-sm font-bold uppercase tracking-wide">Penawaran Spesial</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold mb-3 text-white">{featuredProduct.name}</h2>
                  <div className="flex items-center mb-5">
                    <div className="text-2xl font-bold mr-3 text-white">${featuredProduct.price.toFixed(2)}</div>
                    <div className="text-lg text-white/70 line-through">${(featuredProduct.price * 1.2).toFixed(2)}</div>
                  </div>
                  <motion.button
                    className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg shadow-lg hover:bg-opacity-90 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart(featuredProduct)
                      setShowPromo(false)
                    }}
                  >
                    <FaShoppingCart className="mr-2" /> Tambahkan ke Keranjang
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Main content */}
        <main className="wide-container mx-auto p-4 relative z-20">
          {/* Filter dan Sorting */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <motion.span 
                className="text-purple-600 font-medium text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {filteredProducts.length} produk ditemukan
              </motion.span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 ring-purple-500 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Urutkan: Default</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
                <option value="name-asc">Nama: A ke Z</option>
                <option value="name-desc">Nama: Z ke A</option>
              </select>
            </div>
          </motion.div>

          {/* Produk grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div 
                className="w-16 h-16 border-t-4 border-b-4 rounded-full border-purple-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              className="text-center py-16 text-gray-600 bg-white backdrop-blur-sm rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaSearch className="text-5xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Tidak ada produk ditemukan</h3>
              <p>Coba sesuaikan kriteria pencarian Anda</p>
            </motion.div>
          ) : (
            <motion.div 
              className="product-grid"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05 }
                },
                hidden: {}
              }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="product-card bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl"
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                >
                  {/* Wishlist button */}
                  <div className="absolute top-4 right-4 z-10">
                    <motion.button
                      onClick={() => toggleWishlist(product.id)}
                      className="bg-white rounded-full p-2 shadow-md text-gray-500 hover:text-red-500"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {wishlist.includes(product.id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Produk image */}
                  <div className="product-img-container relative group">
                    <img 
                      src={getImageUrl(product.image_url, product.name)} 
                      alt={product.name} 
                      className="product-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity" />
                    
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.button
                        onClick={() => addToCart(product)}
                        className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={product.stock <= 0}
                      >
                        Beli Cepat
                      </motion.button>
                    </motion.div>
                  </div>
                  
                  {/* Product info */}
                  <div className="product-info">
                    <div className="store-badge">
                      <FaStore className="mr-1" size={10} /> {getStoreNameById(product.store_id)}
                    </div>
                    
                    <h3 className="product-name">{product.name}</h3>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        product.stock > 5 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 0 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 5 
                          ? `Tersedia (${product.stock})` 
                          : product.stock > 0 
                            ? `Stok Terbatas (${product.stock})` 
                            : 'Habis'}
                      </span>
                      
                      <motion.div 
                        className="price"
                        whileHover={{ scale: 1.1 }}
                      >
                        ${product.price.toFixed(2)}
                      </motion.div>
                    </div>
                    
                    <motion.button
                      onClick={() => addToCart(product)}
                      className={`w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors ${
                        product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      whileHover={{ scale: product.stock > 0 ? 1.02 : 1 }}
                      whileTap={{ scale: product.stock > 0 ? 0.98 : 1 }}
                      disabled={product.stock <= 0}
                    >
                      Tambah ke Keranjang
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Floating button */}
          <motion.div
            className="fixed bottom-5 right-5 z-30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button 
              className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-white"
              onClick={() => {
                setShowPromo(true)
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 3000)
              }}
            >
              <FaGift size={24} />
            </button>
          </motion.div>
        </main>
      </div>
      
      {/* Cart sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            
            <motion.div
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            >
              <div className="p-5 border-b sticky top-0 bg-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center">
                    <FaShoppingCart className="mr-2 text-purple-600" /> 
                    Keranjang Belanja
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-2xl text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
              </div>
              
              {cart.length === 0 ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                  <FaShoppingCart className="text-5xl text-gray-300 mb-4" />
                  <p className="text-lg font-medium mb-2">Keranjang belanja Anda kosong</p>
                  <p className="text-sm mb-6">Tambahkan beberapa produk untuk mulai berbelanja</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                  >
                    Lihat Produk
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-5 space-y-5">
                    {cart.map(item => (
                      <motion.div
                        key={item.id}
                        className="flex items-center gap-4 border-b pb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="w-20 h-20 overflow-hidden rounded-lg flex-shrink-0 relative group">
                          <img src={getImageUrl(item.image_url, item.name)} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-1">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                          <p className="font-bold text-purple-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <motion.button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            -
                          </motion.button>
                          <span className="font-medium w-5 text-center">{item.quantity}</span>
                          <motion.button 
                            onClick={() => addToCart(item)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            +
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-5 border-t bg-gray-50 sticky bottom-0">
                    <div className="flex justify-between font-bold mb-2 text-gray-600">
                      <span>Subtotal:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold mb-2 text-gray-600">
                      <span>Saldo Anda:</span>
                      <span>{formatBalance(user?.balance || 0)}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold mb-6 text-lg text-gray-800">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    {user?.balance < cartTotal && (
                      <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-4 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Saldo tidak mencukupi. Silakan isi saldo akun Anda.
                      </div>
                    )}
                    
                    <motion.button
                      onClick={checkout}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors font-semibold"
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      disabled={user?.balance < cartTotal}
                    >
                      {user?.balance < cartTotal ? 'Top Up Saldo' : 'Bayar Sekarang'}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Modal Top Up */}
      <AnimatePresence>
        {isTopUpModalOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTopUpModalOpen(false)}
            />
            
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-xl shadow-xl z-50 overflow-hidden mobile-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center">
                <h2 className="text-xl font-bold flex items-center justify-center">
                  <FaWallet className="mr-2" /> Top Up Saldo
                </h2>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 mb-3 text-center">
                  Saldo Anda saat ini: <span className="font-semibold text-purple-600">{formatBalance(user?.balance || 0)}</span>
                </p>
                
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Top Up (dalam USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="amount"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="pl-8 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[10, 25, 50, 100, 200, 500].map(amount => (
                    <motion.button
                      key={amount}
                      onClick={() => setTopUpAmount(amount)}
                      className={`py-2 rounded-lg border ${
                        topUpAmount === amount 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white border-transparent' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ${amount}
                    </motion.button>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => setIsTopUpModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
                  >
                    Batal
                  </button>
                  <motion.button
                    onClick={handleTopUp}
                    className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={topUpAmount <= 0}
                  >
                    Konfirmasi Top Up
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile notifications */}
      <AnimatePresence>
        {showMobileNotifications && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileNotifications(false)}
            />
            <motion.div 
              className="fixed top-[20%] left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white rounded-xl shadow-xl z-50 overflow-hidden mobile-notification-panel"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white flex justify-between items-center">
                <h3 className="font-bold">Notifikasi</h3>
                {notifications.length > 0 && (
                  <button 
                    className="text-white/80 hover:text-white text-sm"
                    onClick={() => setNotifications([])}
                  >
                    Hapus semua
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <FaBell className="mx-auto text-gray-300 text-3xl mb-3" />
                    <p className="font-medium">Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="p-4 border-b border-gray-100 hover:bg-gray-50"
                    >
                      <p className="text-gray-800 mb-1">{notification.text}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductList