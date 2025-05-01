import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FaUser, FaLock, FaEnvelope, FaBoxOpen, FaShoppingCart, FaRegSmile, FaShieldAlt, FaStore, FaMagic } from 'react-icons/fa'

// Elemen-elemen animasi untuk background yang lebih kaya
const floatingElements = [
  { icon: <FaBoxOpen size={24} />, initialX: '10%', initialY: '20%', duration: 8 },
  { icon: <FaShoppingCart size={20} />, initialX: '80%', initialY: '15%', duration: 12 },
  { icon: <FaStore size={18} />, initialX: '65%', initialY: '75%', duration: 9 },
  { icon: <FaRegSmile size={22} />, initialX: '30%', initialY: '65%', duration: 10 },
  { icon: <FaMagic size={16} />, initialX: '90%', initialY: '50%', duration: 11 },
  { icon: <FaShieldAlt size={26} />, initialX: '20%', initialY: '40%', duration: 14 },
]

const Login = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [easyLoginMode, setEasyLoginMode] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Fetch users di awal
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user');
        if (response.data.success) {
          setUsers(response.data.payload || []);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        let response;
        
        if (easyLoginMode && selectedUserId) {
          // Mode login mudah dengan ID user yang dipilih
          response = await axios.post('http://localhost:3000/user/directLogin', {
            id: selectedUserId
          });
        } else {
          // Login biasa
          response = await axios.post('http://localhost:3000/user/login', {
            email: formData.email,
            password: formData.password
          });
        }

        if (response.data.success) {
          localStorage.setItem('token', response.data.payload.token)
          localStorage.setItem('user', JSON.stringify(response.data.payload.user))
          
          // Tampilkan animasi sukses sebelum redirect
          setShowSuccess(true)
          setTimeout(() => {
            setIsAuthenticated(true)
          }, 1500)
        } else {
          setError(response.data.message)
        }
      } else {
        // Register request dengan POST request
        const response = await axios.post('http://localhost:3000/user/register', {
          username: formData.name,
          email: formData.email,
          password: formData.password
        })

        if (response.data.success) {
          setIsLogin(true)
          setFormData({...formData, name: ''})
          setError('Pendaftaran berhasil! Silakan masuk.')
        } else {
          setError(response.data.message)
        }
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setError('')
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-700 overflow-hidden m-0 p-0 login-page">
      {/* Background pattern */}
      <div className="absolute inset-0 w-full h-full bg-repeat opacity-10" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      {/* Floating Elements for background animation */}
      {floatingElements.map((el, index) => (
        <motion.div 
          key={index}
          className="absolute text-white/10 pointer-events-none"
          initial={{ x: el.initialX, y: el.initialY }}
          animate={{ 
            x: [el.initialX, `calc(${el.initialX} + 10%)`, `calc(${el.initialX} - 10%)`, el.initialX],
            y: [el.initialY, `calc(${el.initialY} - 15%)`, `calc(${el.initialY} + 15%)`, el.initialY],
          }}
          transition={{ 
            duration: el.duration, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        >
          {el.icon}
        </motion.div>
      ))}
      
      {/* Glass-like effect for main container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col md:flex-row w-[95%] max-w-md md:max-w-5xl z-10 overflow-hidden mx-auto"
      >
        {/* Left Side - Form */}
        <div className="w-full md:w-3/5 p-4 md:p-8 bg-white">
          <div className="text-left font-bold flex items-center text-2xl">
            <FaMagic className="text-purple-600 mr-2" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Shop</span>
            <span className="text-gray-800">Easy</span>
          </div>
          
          <div className="py-8 md:py-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </h2>
            <p className="text-gray-500 mb-6 md:mb-8">
              {isLogin ? 'Masuk untuk akses akun Anda' : 'Daftar untuk mulai berbelanja'}
            </p>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-lg mb-4 flex items-center ${error.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {error.includes('berhasil') ? 
                    <FaRegSmile className="mr-2" /> : 
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  }
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Mode Easy Login - Pilih User dari Dropdown */}
              {isLogin && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center mb-1 bg-purple-50 p-2 rounded-lg"
                >
                  <input
                    type="checkbox"
                    id="easyLoginMode"
                    checked={easyLoginMode}
                    onChange={() => setEasyLoginMode(!easyLoginMode)}
                    className="mr-2 h-4 w-4 text-purple-600"
                  />
                  <label htmlFor="easyLoginMode" className="text-sm text-gray-700 font-medium">
                    Login Cepat (Pilih Pengguna)
                  </label>
                </motion.div>
              )}
              
              <AnimatePresence>
                {isLogin && easyLoginMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 mb-2"
                  >
                    <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Pengguna untuk Login
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                        <FaUser />
                      </div>
                      <select
                        id="userSelect"
                        className="w-full pl-10 p-3 border-2 rounded-lg border-gray-200 focus:border-purple-500 focus:outline-none bg-white text-gray-800 appearance-none"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                      >
                        <option value="">-- Pilih Pengguna --</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id} className="text-gray-800">
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 pointer-events-none">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form register dan login normal (jika tidak dalam mode easy login) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="group relative"
                  >
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nama Pengguna"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 p-3 border-2 rounded-lg border-gray-200 focus:border-purple-500 focus:outline-none w-full transition-all text-gray-800 bg-white"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {(!easyLoginMode || !isLogin) && (
                  <>
                    <motion.div 
                      initial={isLogin ? { opacity: 1 } : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="group relative"
                    >
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <FaEnvelope />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 p-3 border-2 rounded-lg border-gray-200 focus:border-purple-500 focus:outline-none w-full transition-all text-gray-800 bg-white"
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      initial={isLogin ? { opacity: 1 } : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="group relative"
                    >
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <FaLock />
                      </div>
                      <input
                        type="password"
                        name="password"
                        placeholder="Kata Sandi"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 p-3 border-2 rounded-lg border-gray-200 focus:border-purple-500 focus:outline-none w-full transition-all text-gray-800 bg-white"
                        required
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              
              <motion.button 
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg hover:shadow-lg transition duration-300 mt-4 font-semibold flex justify-center items-center"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                disabled={loading || (easyLoginMode && !selectedUserId)}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  isLogin ? 'Masuk' : 'Daftar'
                )}
              </motion.button>
            </form>
            
            <div className="text-center mt-6">
              <button 
                onClick={toggleForm} 
                className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition"
              >
                {isLogin ? "Belum punya akun? Daftar Sekarang" : "Sudah punya akun? Masuk"}
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Welcome */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-600 to-blue-500 text-white py-12 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-white/10"></div>
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {isLogin ? 'Selamat Datang Kembali!' : 'Bergabunglah Bersama Kami!'}
          </h2>
          
          <p className="mb-8 text-white/80 text-sm md:text-base">
            {isLogin 
              ? 'Berbelanja dengan mudah dan nikmati penawaran serta diskon eksklusif di platform kami.' 
              : 'Buat akun untuk menikmati pengalaman belanja personal dan lacak pesanan Anda dengan mudah.'}
          </p>
          
          <motion.div 
            className="mt-8 md:mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4 shadow-lg">
                <FaBoxOpen className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Pengiriman Cepat</h3>
                <p className="text-white/70 text-sm">Dapatkan produk Anda dengan cepat</p>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4 shadow-lg">
                <FaShoppingCart className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Belanja Mudah</h3>
                <p className="text-white/70 text-sm">Antarmuka yang ramah pengguna</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4 shadow-lg">
                <FaShieldAlt className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Transaksi Aman</h3>
                <p className="text-white/70 text-sm">Keamanan pembayaran terjamin</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Success animation overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-full h-24 w-24 flex items-center justify-center"
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Login