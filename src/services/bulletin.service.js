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
}

export default new BulletinService(); 