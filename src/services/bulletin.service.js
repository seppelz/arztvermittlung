import api from './api';

/**
 * Service for bulletin board related API calls
 */
class BulletinService {
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
        // Ensure startDate is a Date object (if string, convert to Date)
        if (typeof bulletinData.startDate === 'string') {
          processedData.startDate = new Date(bulletinData.startDate);
        }
        
        console.log('BulletinService: Using startDate for job listing:', processedData.startDate);
      } else if ((bulletinData.messageType === 'Angebot' || bulletinData.messageType === 'Gesuch') && !bulletinData.startDate) {
        // If no startDate provided for job listings, set to current date
        processedData.startDate = new Date();
        console.log('BulletinService: No startDate provided, using current date:', processedData.startDate);
      }
      
      const response = await api.post('/bulletin', processedData);
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
  async addReply(bulletinId, replyData) {
    try {
      console.log('BulletinService: Adding reply to bulletin:', bulletinId);
      console.log('BulletinService: Reply data:', replyData);
      
      // Remove timestamp from reply data as it will be set by the server
      const { timestamp, ...dataToSend } = replyData;
      
      // Get user ID from localStorage
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      
      if (user && user._id) {
        dataToSend.userId = user._id;
      }
      
      const response = await api.post(`/bulletin/${bulletinId}/replies`, dataToSend);
      console.log('BulletinService: Reply added successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error adding reply:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        bulletinId,
        replyData
      });
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
      console.log(`BulletinService: Deleting reply ${replyId} from bulletin ${bulletinId}`);
      const response = await api.delete(`/bulletin/${bulletinId}/replies/${replyId}`);
      console.log('BulletinService: Reply deleted successfully');
      return response;
    } catch (error) {
      console.error('Error deleting reply:', error);
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
  async updateReply(bulletinId, replyId, replyData) {
    try {
      console.log(`BulletinService: Updating reply ${replyId} in bulletin ${bulletinId}`);
      
      // Get user ID from localStorage
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      
      if (user && user._id) {
        replyData.userId = user._id;
      }
      
      const response = await api.patch(`/bulletin/${bulletinId}/replies/${replyId}`, replyData);
      console.log('BulletinService: Reply updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating reply:', error);
      throw error;
    }
  }
}

export default new BulletinService(); 