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
  initialized: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    status: 'idle', // 'idle', 'loading', 'authenticated', 'error'
    expiresAt: null,
    error: null,
    initialized: false
  }),
  
  getters: {
    isAuthenticated: (state): boolean => {
      const authenticated = !!state.token && !!state.user && state.status === 'authenticated';
      if (import.meta.env.DEV) {
        console.log('[AUTH STORE] isAuthenticated check', {
          hasToken: !!state.token,
          hasUser: !!state.user,
          status: state.status,
          authenticated
        });
      }
      return authenticated;
    },
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
        console.log('[AUTH STORE] Setting auth data:', {
          user: { ...userData.user, _id: userData.user._id },
          hasToken: !!userData.token
        });
        
        // Store user data from login/register response
        this.user = userData.user;
        this.token = userData.token;
        this.status = 'authenticated';
        
        // Save to localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('token', userData.token);
        
        // Store initialization time for token validation
        const now = Date.now();
        localStorage.setItem('auth_initialized', now.toString());
        
        // Add event to detect when tab/browser is closed and reopened
        window.addEventListener('focus', this.validateToken);
        
        console.log('[AUTH STORE] Auth data set successfully');
      } catch (error) {
        console.error('[AUTH STORE] Error setting auth state:', error);
        this.clearAuth();
      }
    },
    
    validateToken(): boolean {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('[AUTH STORE] No token found during validation');
          return false;
        }
        
        // Check for token expiration if it's a JWT (simple check)
        if (token.split('.').length === 3) {
          try {
            // Get payload from JWT
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            
            // Check if token has expiration
            if (payload.exp) {
              const expirationTime = payload.exp * 1000; // Convert to milliseconds
              const now = Date.now();
              
              // Add a buffer of 5 minutes to handle clock skew
              const expirationBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
              const effectiveExpirationTime = expirationTime - expirationBuffer;
              
              if (now >= effectiveExpirationTime) {
                console.warn('[AUTH STORE] Token expired or close to expiring, logging out');
                this.clearAuth();
                return false;
              }
              
              // Calculate remaining time
              const remainingTime = expirationTime - now;
              console.log(`[AUTH STORE] Token valid for approximately ${Math.floor(remainingTime / 60000)} more minutes`);
            }
          } catch (e) {
            console.error('[AUTH STORE] Error parsing JWT:', e);
            return false;
          }
        }
        
        // If we have a user object and a valid token, consider authentication valid
        if (this.user && this.status === 'authenticated') {
          console.log('[AUTH STORE] Token validated successfully');
          return true;
        } else {
          console.warn('[AUTH STORE] Token exists but user data or status is invalid');
          return false;
        }
      } catch (error) {
        console.error('[AUTH STORE] Error validating token:', error);
        return false;
      }
    },
    
    initAuth(): Promise<void> {
      return new Promise((resolve) => {
        try {
          console.log('[AUTH STORE] Initializing auth state');
          
          // Check if user data exists in localStorage
          const userJson = localStorage.getItem('user');
          const token = localStorage.getItem('token');
          
          if (userJson && token) {
            try {
              const user = JSON.parse(userJson) as User;
              console.log('[AUTH STORE] Found stored auth data:', {
                userId: user._id,
                hasToken: !!token
              });
              
              this.user = user;
              this.token = token;
              this.status = 'authenticated';
              
              // Validate token
              this.validateToken();
              
              // Register focus event listener to validate token when tab is reopened
              window.addEventListener('focus', this.validateToken);
            } catch (parseError) {
              console.error('[AUTH STORE] Error parsing stored user data:', parseError);
              this.clearAuth();
            }
          } else {
            console.log('[AUTH STORE] No stored auth data found');
          }
          
          // Mark the store as initialized regardless of outcome
          this.initialized = true;
          console.log('[AUTH STORE] Auth state initialized, authenticated:', this.isAuthenticated);
          resolve();
        } catch (error) {
          console.error('[AUTH STORE] Error initializing auth state:', error);
          this.clearAuth();
          this.initialized = true;
          resolve();
        }
      });
    },
    
    clearAuth(): void {
      // Clear auth data on logout
      console.log('[AUTH STORE] Clearing auth data');
      this.user = null;
      this.token = null;
      this.status = 'idle';
      
      // Remove from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('auth_initialized');
      
      // Remove event listener
      window.removeEventListener('focus', this.validateToken);
      
      console.log('[AUTH STORE] Auth data cleared');
    },
    
    logout(): Promise<void> {
      console.log('[AUTH STORE] Processing logout');
      // Call clearAuth to handle the logout process
      this.clearAuth();
      return Promise.resolve(); // Return a resolved promise for async/await compatibility
    },
    
    updateUser(userData: Partial<User>): void {
      try {
        if (!this.user) {
          console.error('[AUTH STORE] Cannot update user data: No user is authenticated');
          return;
        }
        
        console.log('[AUTH STORE] Updating user data');
        
        // Update user data after profile update
        this.user = { ...this.user, ...userData };
        localStorage.setItem('user', JSON.stringify(this.user));
        
        console.log('[AUTH STORE] User data updated successfully');
      } catch (error) {
        console.error('[AUTH STORE] Error updating user data:', error);
      }
    }
  }
}) 