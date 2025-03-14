import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  
  getters: {
    isAdmin: (state) => {
      return state.user && state.user.role === 'admin'
    },
    isDoctor: (state) => {
      return state.user && state.user.userType === 'Arzt'
    },
    isHospital: (state) => {
      return state.user && state.user.userType === 'Klinik'
    }
  },
  
  actions: {
    setAuth(userData) {
      // Store user data from login/register response
      this.user = userData.user
      this.token = userData.token
      this.isAuthenticated = true
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData.user))
      localStorage.setItem('token', userData.token)
    },
    
    initAuth() {
      // Check if user data exists in localStorage
      const user = JSON.parse(localStorage.getItem('user'))
      const token = localStorage.getItem('token')
      
      if (user && token) {
        this.user = user
        this.token = token
        this.isAuthenticated = true
      }
    },
    
    clearAuth() {
      // Clear auth data on logout
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // Remove from localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    
    updateUser(userData) {
      // Update user data after profile update
      this.user = { ...this.user, ...userData }
      localStorage.setItem('user', JSON.stringify(this.user))
    }
  }
}) 