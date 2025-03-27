import { defineStore } from 'pinia'

// User interface definition
interface User {
  _id?: string;
  name: string;
  email: string;
  role?: 'user' | 'admin' | 'doctor' | 'hospital';
  userType?: string;
  profileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  expiresAt: number | null;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    status: 'idle', // 'idle', 'loading', 'authenticated', 'error'
    expiresAt: null,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state): boolean => !!state.token && !!state.user && state.status === 'authenticated',
    isAdmin: (state): boolean => state.user?.role === 'admin',
    isDoctor: (state): boolean => state.user?.role === 'doctor' || state.user?.userType === 'Arzt',
    isHospital: (state): boolean => state.user?.role === 'hospital' || state.user?.userType === 'Klinik',
    isClient: (state): boolean => state.user?.role === 'user',
    authStatus: (state): AuthState['status'] => state.status,
    
    // Safe getters for user properties
    userId: (state): string | null => state.user?._id || null,
    userName: (state): string | null => state.user?.name || null,
    userEmail: (state): string | null => state.user?.email || null,
  },
  
  actions: {
    setAuth(userData: { user: User; token: string }): void {
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
    
    initAuth(): void {
      try {
        // Check if user data exists in localStorage
        const userJson = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        
        if (userJson && token) {
          const user = JSON.parse(userJson) as User
          this.user = user
          this.token = token
          this.status = 'authenticated'
        }
      } catch (error) {
        console.error('Error initializing auth state:', error)
        this.clearAuth()
      }
    },
    
    clearAuth(): void {
      // Clear auth data on logout
      this.user = null
      this.token = null
      this.status = 'idle'
      
      // Remove from localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    
    logout(): Promise<void> {
      // Call clearAuth to handle the logout process
      this.clearAuth()
      return Promise.resolve() // Return a resolved promise for async/await compatibility
    },
    
    updateUser(userData: Partial<User>): void {
      try {
        if (!this.user) {
          console.error('Cannot update user data: No user is authenticated')
          return
        }
        
        // Update user data after profile update
        this.user = { ...this.user, ...userData }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        console.error('Error updating user data:', error)
      }
    }
  }
}) 