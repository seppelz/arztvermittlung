import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    status: 'idle', // 'idle', 'loading', 'authenticated', 'error'
    expiresAt: null,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user && state.status === 'authenticated',
    isAdmin: (state) => state.user?.role === 'admin',
    isDoctor: (state) => state.user?.role === 'doctor',
    isClient: (state) => state.user?.role === 'client',
    authStatus: (state) => state.status,
    
    // Safe getters for user properties
    userId: (state) => state.user?._id || null,
    userName: (state) => state.user?.name || null,
    userEmail: (state) => state.user?.email || null,
  },
  
  actions: {
    setAuth(userData) {
      try {
        // Store user data from login/register response
        this.user = userData.user
        this.token = userData.token
        this.status = 'authenticated'
        
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
          this.status = 'authenticated'
        }
      } catch (error) {
        console.error('Error initializing auth state:', error)
        this.clearAuth()
      }
    },
    
    clearAuth() {
      // Clear auth data on logout
      this.user = null
      this.token = null
      this.status = 'idle'
      
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