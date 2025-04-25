import { defineStore } from 'pinia'
import { authService } from '@/services/auth'

interface User {
  id: string
  username: string
  // Add other user properties as needed
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface AuthResponse {
  response_key: string
  response_message: string
  data: any
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async login(username: string, password: string) {
      try {
        const data = await authService.login({ username, password })
        this.token = data?.data?.token
        this.user = data?.data?.user
        this.isAuthenticated = true

        return data?.data?.user
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        await authService.logout()
        this.reset()
      } catch (error) {
        console.error('Logout error:', error)
        this.reset()
      }
    },

    async checkAuth() {
      try {
        const { token, user } = await authService.refreshToken()

        if (token && user) {
          this.token = token
          this.user = user
          this.isAuthenticated = true
        } else {
          this.reset()
        }
      } catch (error) {
        this.reset()
      }
    },

    reset() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    }
  }
})
