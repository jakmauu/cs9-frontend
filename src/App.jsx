import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
    
    // Pastikan body selalu full height dan width
    document.documentElement.style.height = '100%'
    document.documentElement.style.width = '100%'
    document.body.style.height = '100%'
    document.body.style.width = '100%'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.overflow = 'hidden'
    
    // Set warna background default
    document.body.style.background = 'linear-gradient(135deg, #4d6bff 0%, #7642ff 100%)'
  }, [])

  return (
    <BrowserRouter>
      <Routes>
  <Route 
    path="/" 
    element={isAuthenticated ? <Navigate to="/products" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
  />
  <Route 
    path="/products" 
    element={isAuthenticated ? <ProductList setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
  />
</Routes>
    </BrowserRouter>
  )
}

export default App
