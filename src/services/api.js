import axios from 'axios'

const API_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
})


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// User endpoint
export const loginUser = (email, password) => 
  api.post('/user/login', null, { params: { email, password } })

export const registerUser = (username, email, password) => 
  api.post('/user/register', null, { params: { username, email, password } })

// Item endpoints
export const getAllItems = () => 
  api.get('/item')

export const getItemById = (id) => 
  api.get(`/item/byId/${id}`)

export const updateItemStock = (itemData) => 
  api.put('/item/updateStock', itemData)

export const getItemsRefresh = () =>
  api.get('/item')

// Store endpoints
export const getAllStores = () => 
  api.get('/store/getAll')

// Transaction endpoints
export const createTransaction = (transaction) => 
  api.post('/transaction/create', transaction)

export const payTransaction = (id) => 
  api.post(`/transaction/pay/${id}`)

export const updateUserBalance = (userData) => 
  api.post('/user/updateBalance', userData)

export default api