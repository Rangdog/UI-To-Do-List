import axios from 'axios'
import Cookies from 'js-cookie'
import api from '@/utils/axios'
import type { User } from '@/types/user'

// Constants
const API_URL = 'http://35.185.181.50/api' // http://35.185.181.50
const TOKEN_COOKIE = 'auth_token'
const TOKEN_EXPIRY = 7 // days

// Custom axios instance for auth
const apiAuth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
apiAuth.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_COOKIE)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData extends LoginCredentials {
  name: string
}

interface AuthResponse {
  response_key: string
  response_message: string
  data: any
}

export const authService = {
  // Login and store token in cookie
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try{
      const response = await apiAuth.post<AuthResponse>('/login', credentials)
      console.log(response.data);
      return response.data
    }catch(error:any){
      return error.response.data
    }
  },

  // Logout and remove token
  async logout() {
    try {
      await apiAuth.post('/logout')
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      Cookies.remove(TOKEN_COOKIE)
    }
  },

  // Get current auth state (for initial app load or refresh)
  async refreshToken() {
    const token = Cookies.get(TOKEN_COOKIE)

    if (!token) {
      return { token: null, user: null }
    }

    try {
      const response = await apiAuth.post('/refresh')
      const { token: newToken, user } = response.data

      // Update token in cookie
      Cookies.set(TOKEN_COOKIE, newToken, { expires: TOKEN_EXPIRY, sameSite: 'strict' })

      return { token: newToken, user }
    } catch (error) {
      Cookies.remove(TOKEN_COOKIE)
      return { token: null, user: null }
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!Cookies.get(TOKEN_COOKIE)
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try{
      const response = await apiAuth.post<AuthResponse>('/register', data)
      return response.data
    }catch(error:any){
      return error.response.data
    }
  },
}
