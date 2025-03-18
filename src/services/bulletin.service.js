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
      const response = await api.get('/bulletins', { params });
      return response.data;
    } catch (error) {
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
      const response = await api.get(`/bulletins/${id}`);
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
      const response = await api.post('/bulletins', bulletinData);
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
      const response = await api.patch(`/bulletins/${id}`, bulletinData);
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
      const response = await api.delete(`/bulletins/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new BulletinService(); 