import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isInitialized: false
  }),
  
  getters: {
    isAdmin: (state) => {
      return state.user && state.user.role === 'admin'
    },
    isDoctor: (state) => {
      return state.user && (state.user.role === 'doctor' || (state.user.role === 'user' && state.user.userType === 'Arzt'))
    },
    isHospital: (state) => {
      return state.user && (state.user.role === 'hospital' || (state.user.role === 'user' && state.user.userType === 'Klinik'))
    }
  },
  
  actions: {
    setAuth(userData) {
      try {
        // Store user data from login/register response
        this.user = userData.user
        this.token = userData.token
        this.isAuthenticated = true
        
        // Save to localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData.user))
        localStorage.setItem('token', userData.token)
      } catch (error) {
        console.error('Error setting auth state:', error)
        this.clearAuth()
      }
    },
    
    initAuth() {
      try {
        // Check if user data exists in localStorage
        const userJson = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        
        if (userJson && token) {
          const user = JSON.parse(userJson)
          this.user = user
          this.token = token
          this.isAuthenticated = true
        }
      } catch (error) {
        console.error('Error initializing auth state:', error)
        this.clearAuth()
      } finally {
        this.isInitialized = true
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
    
    logout() {
      // Call clearAuth to handle the logout process
      this.clearAuth()
      return Promise.resolve() // Return a resolved promise for async/await compatibility
    },
    
    updateUser(userData) {
      try {
        // Update user data after profile update
        this.user = { ...this.user, ...userData }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        console.error('Error updating user data:', error)
      }
    }
  }
}) 