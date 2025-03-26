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
      
      // Try with a different URL structure - bulletins (plural) instead of bulletin
      let endpoint = '/bulletins';
      
      // First attempt with the new URL
      try {
        console.log(`BulletinService: First attempt with endpoint ${endpoint}`);
        
        const response = await api.get(endpoint, { 
          params,
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log(`BulletinService: Response received successfully from ${endpoint}`);
        
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
        
      } catch (firstError) {
        // If first attempt fails, try with original endpoint
        console.log('BulletinService: First attempt failed, trying original endpoint /bulletin');
        endpoint = '/bulletin';
        
        // Try sending the request without the sort parameter
        const simplifiedParams = { ...params };
        delete simplifiedParams.sort;
        
        console.log('BulletinService: Using simplified params without sort:', simplifiedParams);
        
        const response = await api.get(endpoint, {
          params: simplifiedParams,
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log(`BulletinService: Response received successfully from ${endpoint}`);
        
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
      }
      
    } catch (error) {
      console.error('BulletinService: Error fetching bulletins:', error);
      
      // Attempt to extract meaningful error info
      const errorInfo = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
      
      console.error('BulletinService: Error details:', errorInfo);
      
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
      const response = await api.get(`/bulletin/${id}`);
      return response.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
      console.error('BulletinService: Error updating bulletin:', error);
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
      const response = await api.delete(`/bulletin/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new BulletinService(); 