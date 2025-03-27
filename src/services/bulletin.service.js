import api from './api';
import { useAuthStore } from '@/stores/auth';

/**
 * Service for bulletin board related API calls
 */
class BulletinService {
  constructor() {
    this.authStore = useAuthStore();
    this.initializeGuestSession();
  }

  // Initialize guest session if needed
  initializeGuestSession() {
    if (!this.authStore.isAuthenticated && !localStorage.getItem('sessionId')) {
      const sessionId = crypto.randomUUID();
      localStorage.setItem('sessionId', sessionId);
    }
  }

  // Get current session ID
  getSessionId() {
    if (this.authStore.isAuthenticated) {
      return null;
    }
    return localStorage.getItem('sessionId');
  }

  /**
   * Get all bulletins
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - Promise with bulletins
   */
  async getAllBulletins(params = {}) {
    try {
      console.log('BulletinService: Fetching bulletins with params:', params);
      
      // Always use the /bulletin endpoint for consistency
      const endpoint = '/bulletin';
      
      // Maximum timeout for API calls
      const TIMEOUT = 15000;
      
      const response = await api.get(endpoint, { 
        params,
        timeout: TIMEOUT,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log(`BulletinService: Response received successfully from ${endpoint}`);
      console.log('BulletinService: Response structure:', { 
        status: response.status,
        hasData: !!response.data,
        dataType: response.data ? typeof response.data : 'undefined',
        isArray: response.data ? Array.isArray(response.data) : false,
        hasNestedData: response.data && response.data.data ? true : false
      });
      
      // Process response data
      if (!response.data) {
        console.warn('BulletinService: Empty response data');
        return { data: [] };
      }
      
      // Return appropriate data structure
      if (Array.isArray(response.data)) {
        console.log('BulletinService: Response is an array with', response.data.length, 'items');
        return { data: response.data };
      }
      
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log('BulletinService: Found nested data array with', response.data.data.length, 'items');
        return response.data;
      }
      
      console.warn('BulletinService: Unexpected response format', response.data);
      return { data: [] };
    } catch (error) {
      console.error('BulletinService: Error fetching bulletins:', error);
      
      // Attempt to extract meaningful error info
      const errorInfo = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      };
      
      console.error('BulletinService: Error details:', errorInfo);
      
      if (error.response?.status === 401) {
        console.error('BulletinService: Authentication error - user may not be logged in');
      } else if (error.response?.status === 403) {
        console.error('BulletinService: Authorization error - user may not have permission');
      } else if (error.response?.status === 404) {
        console.error('BulletinService: API endpoint not found - incorrect path or missing route');
      } else if (error.response?.status === 500) {
        console.error('BulletinService: Server error - check backend logs for details');
        console.error('BulletinService: Response from server:', error.response?.data);
      } else if (error.code === 'ECONNABORTED') {
        console.error('BulletinService: Request timeout - server took too long to respond');
      } else if (error.message.includes('Network Error')) {
        console.error('BulletinService: Network error - CORS issue or server unreachable');
      }
      
      // Re-throw with more context
      throw error;
    }
  }

  /**
   * Get a bulletin by ID
   * @param {String} id - Bulletin ID
   * @returns {Promise} - Promise with the bulletin
   */
  async getBulletinById(id) {
    try {
      console.log(`BulletinService: Getting bulletin with ID ${id}`);
      const response = await api.get(`/bulletin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`BulletinService: Error getting bulletin with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new bulletin
   * @param {Object} bulletinData - Bulletin data
   * @returns {Promise} - Promise with the created bulletin
   */
  async createBulletin(bulletinData) {
    try {
      console.log('BulletinService: Creating new bulletin:', bulletinData);
      
      // Process the data to ensure dates are properly formatted
      const processedData = { ...bulletinData };
      
      // Ensure startDate is properly set for job listings
      if ((bulletinData.messageType === 'Angebot' || bulletinData.messageType === 'Gesuch') && bulletinData.startDate) {
        if (typeof bulletinData.startDate === 'string') {
          processedData.startDate = new Date(bulletinData.startDate);
        }
      } else if ((bulletinData.messageType === 'Angebot' || bulletinData.messageType === 'Gesuch') && !bulletinData.startDate) {
        processedData.startDate = new Date();
      }
      
      const response = await api.post('/bulletin', {
        ...processedData,
        userId: this.authStore.isAuthenticated ? this.authStore.userId : null,
        sessionId: this.getSessionId()
      });
      console.log('BulletinService: Bulletin created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('BulletinService: Error creating bulletin:', error);
      console.error('BulletinService: Error details:', error.response || error.message);
      throw error;
    }
  }

  /**
   * Update a bulletin
   * @param {String} id - Bulletin ID
   * @param {Object} bulletinData - Updated bulletin data
   * @returns {Promise} - Promise with the updated bulletin
   */
  async updateBulletin(id, bulletinData) {
    try {
      console.log(`BulletinService: Updating bulletin ${id}:`, bulletinData);
      
      // Process the data to ensure dates are properly formatted
      const processedData = { ...bulletinData };
      
      // Ensure startDate is properly set for job listings if provided
      if (bulletinData.startDate) {
        // Ensure startDate is a Date object (if string, convert to Date)
        if (typeof bulletinData.startDate === 'string') {
          processedData.startDate = new Date(bulletinData.startDate);
        }
        
        console.log('BulletinService: Using startDate for update:', processedData.startDate);
      }
      
      const response = await api.patch(`/bulletin/${id}`, processedData);
      console.log(`BulletinService: Bulletin ${id} updated successfully:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`BulletinService: Error updating bulletin ${id}:`, error);
      console.error('BulletinService: Error details:', error.response || error.message);
      throw error;
    }
  }

  /**
   * Delete a bulletin
   * @param {String} id - Bulletin ID
   * @returns {Promise} - Promise with the delete response
   */
  async deleteBulletin(id) {
    try {
      console.log(`BulletinService: Deleting bulletin ${id}`);
      const response = await api.delete(`/bulletin/${id}`);
      console.log(`BulletinService: Bulletin ${id} deleted successfully`);
      return response.data;
    } catch (error) {
      console.error(`BulletinService: Error deleting bulletin ${id}:`, error);
      throw error;
    }
  }

  // Add reply to a bulletin message
  async addReply(bulletinId, reply) {
    try {
      console.log('BulletinService: Adding reply to bulletin', bulletinId);
      const authStore = useAuthStore();
      
      // Get auth status and user info safely
      const isAuthenticated = authStore.isAuthenticated;
      const userId = authStore.userId;
      
      console.log('BulletinService: Auth status:', isAuthenticated ? 'Authenticated' : 'Guest');
      console.log('BulletinService: User ID from auth store:', userId || 'Not available');
      
      // Prepare reply data based on authentication status
      let replyData = { ...reply };
      
      if (isAuthenticated && userId) {
        // For authenticated users: Use the userID from auth store
        replyData.userId = userId;
        console.log('BulletinService: Using authenticated user ID:', userId);
        
        // For authenticated users, we don't need name/email as they're in the user profile
        delete replyData.name;
        delete replyData.email;
      } else {
        // For guest users: Ensure required fields are present
        if (!replyData.name || !replyData.email) {
          console.error('BulletinService: Name and email are required for guest users');
          throw new Error('Name and email are required for guest users');
        }
        
        console.log('BulletinService: Using guest user mode with name:', replyData.name);
        delete replyData.userId; // Remove any potential userId for guest users
      }
      
      // Include session ID for all replies (will be ignored for authenticated users)
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        console.log('BulletinService: Including session ID for tracking');
      }
      
      console.log('BulletinService: Final reply data:', replyData);
      
      // Set a timeout for the request to avoid hanging
      const response = await api.post(`/bulletin/${bulletinId}/replies`, replyData, {
        timeout: 15000, // 15 seconds timeout
        headers: sessionId ? { 'Session-ID': sessionId } : {}
      });
      
      console.log('BulletinService: Reply added successfully');
      return response;
    } catch (error) {
      console.error('BulletinService: Error adding reply:', error.message);
      console.error('BulletinService: Error details:', error.response?.data);
      
      // Improve error context
      if (error.response) {
        console.error(`BulletinService: Server returned status ${error.response.status}`);
        
        const authStore = useAuthStore();
        const contextInfo = {
          isAuthenticated: authStore.isAuthenticated,
          hasUserId: !!authStore.userId,
          sessionId: localStorage.getItem('sessionId'),
          responseData: error.response.data
        };
        console.error('BulletinService: Error context:', contextInfo);
      }
      
      throw error;
    }
  }

  /**
   * Delete a reply from a bulletin message
   * @param {String} bulletinId - Bulletin ID
   * @param {String} replyId - Reply ID to delete
   * @returns {Promise} - Promise with the delete response
   */
  async deleteReply(bulletinId, replyId) {
    try {
      console.log('BulletinService: Deleting reply', replyId, 'from bulletin', bulletinId);
      
      // Set up headers with session ID for guest users
      const headers = {};
      
      // Add session ID to headers for guest users
      if (!this.authStore.isAuthenticated) {
        const sessionId = this.getSessionId();
        headers['X-Session-Id'] = sessionId;
        console.log('BulletinService: Using guest session ID for delete:', sessionId);
      }
      
      const response = await api.delete(`/bulletin/${bulletinId}/replies/${replyId}`, { headers });
      
      console.log('BulletinService: Reply deleted successfully');
      return response.data;
    } catch (error) {
      console.error('BulletinService: Error deleting reply:', error);
      throw error;
    }
  }

  /**
   * Update a reply in a bulletin message
   * @param {String} bulletinId - Bulletin ID
   * @param {String} replyId - Reply ID to update
   * @param {Object} replyData - Updated reply data
   * @returns {Promise} - Promise with the update response
   */
  async updateReply(bulletinId, replyId, content) {
    try {
      console.log('BulletinService: Updating reply', replyId, 'in bulletin', bulletinId);
      
      // Set up headers with session ID for guest users
      const headers = {};
      
      const dataToSend = {
        content,
        userId: this.authStore.isAuthenticated ? this.authStore.userId : null
      };
      
      // For guest users, include session ID in both headers and body
      if (!this.authStore.isAuthenticated) {
        const sessionId = this.getSessionId();
        dataToSend.sessionId = sessionId;
        headers['X-Session-Id'] = sessionId;
        console.log('BulletinService: Using guest session ID for update:', sessionId);
      }

      console.log('BulletinService: Sending update data:', dataToSend);
      
      const response = await api.patch(`/bulletin/${bulletinId}/replies/${replyId}`, dataToSend, { headers });
      
      console.log('BulletinService: Reply updated successfully');
      return response.data;
    } catch (error) {
      console.error('BulletinService: Error updating reply:', error);
      throw error;
    }
  }

  // Get user's bulletins (both authenticated and guest)
  async getUserBulletins(params = {}) {
    try {
      const response = await api.get('/bulletin/user', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user bulletins:', error);
      throw error;
    }
  }

  // Check if a user can edit/delete a bulletin
  canEditBulletin(bulletin) {
    if (!bulletin) return false;
    if (this.authStore.isAdmin) return true;
    if (this.authStore.isAuthenticated) {
      return bulletin.userId === this.authStore.userId;
    }
    return bulletin.sessionId === this.getSessionId();
  }

  // Check if a user can edit/delete a reply
  canEditReply(reply) {
    if (!reply) return false;
    if (this.authStore.isAdmin) return true;
    if (this.authStore.isAuthenticated) {
      return reply.userId === this.authStore.userId;
    }
    return reply.sessionId === this.getSessionId();
  }
}

export default new BulletinService(); 