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
      console.log('BulletinService: Fetching all bulletins with params:', params);
      console.log('BulletinService: Using API URL:', api.defaults.baseURL);
      
      const response = await api.get('/bulletin', { params });
      console.log('BulletinService: Response received:', response);
      
      if (!response.data) {
        console.warn('BulletinService: No data in response');
        return { data: [] };
      }
      
      if (response.data.data) {
        // Handle response structure from backend (data property contains bulletins)
        console.log('BulletinService: Found nested data structure with', response.data.data.length, 'items');
        return response.data;
      } else {
        // Direct array response
        console.log('BulletinService: Found direct data array with', response.data.length, 'items');
        return { data: response.data };
      }
    } catch (error) {
      console.error('BulletinService: Error fetching bulletins:', error);
      console.error('BulletinService: Error details:', error.response || error.message);
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
      const response = await api.post('/bulletin', bulletinData);
      return response.data;
    } catch (error) {
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
      const response = await api.patch(`/bulletin/${id}`, bulletinData);
      return response.data;
    } catch (error) {
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