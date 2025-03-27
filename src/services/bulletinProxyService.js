import bulletinService from './bulletin.service';

/**
 * Service that directly passes bulletin requests to the bulletin service
 * with no demo data fallback, ensuring only real data is used
 */
class BulletinProxyService {
  /**
   * Get all bulletins from the real API only
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - Promise with bulletins data
   */
  async getAllBulletins(params = {}) {
    console.log('BulletinProxyService: Fetching bulletins with params:', params);
    
    try {
      // No fallback to demo data - use real API only
      const response = await bulletinService.getAllBulletins(params);
      
      console.log('BulletinProxyService: Raw response from service:', 
        response ? 'Response received' : 'No response',
        'Status:', response?.status);
        
      // Check data structure more carefully
      if (!response) {
        console.warn('BulletinProxyService: No response received from bulletin service');
        return { data: [] };
      }
      
      // Handle case where response.data is an object with a data property (nested data)
      if (response.data && !Array.isArray(response.data) && response.data.data && Array.isArray(response.data.data)) {
        console.log('BulletinProxyService: Found nested data array with', response.data.data.length, 'items');
        return { data: response.data.data };
      }
      
      // Handle case where response.data is directly an array
      if (response.data && Array.isArray(response.data)) {
        console.log('BulletinProxyService: Found direct data array with', response.data.length, 'items');
        return { data: response.data };
      }
      
      // If we get here, we have a response but data isn't in expected format
      console.warn('BulletinProxyService: API returned unexpected data format:', 
        typeof response.data, 
        response.data ? 'has data' : 'no data');
      
      return { data: [] };
    } catch (error) {
      console.error('BulletinProxyService: Error fetching bulletins:', error.message);
      return { data: [] };
    }
  }

  /**
   * Not using demo data ever
   */
  isUsingDemoData() {
    return false;
  }

  /**
   * Create a new bulletin using real API only
   * @param {Object} bulletinData - Bulletin data to create
   * @returns {Promise} - Promise with created bulletin
   */
  async createBulletin(bulletinData) {
    console.log('BulletinService: Creating bulletin:', bulletinData);
    return await bulletinService.createBulletin(bulletinData);
  }

  /**
   * Get a bulletin by ID using real API only
   * @param {String} id - Bulletin ID
   * @returns {Promise} - Promise with the bulletin
   */
  async getBulletinById(id) {
    console.log('BulletinService: Getting bulletin by ID:', id);
    return await bulletinService.getBulletinById(id);
  }

  /**
   * Update a bulletin using real API only
   * @param {String} id - Bulletin ID
   * @param {Object} bulletinData - Updated bulletin data
   * @returns {Promise} - Promise with the updated bulletin
   */
  async updateBulletin(id, bulletinData) {
    console.log('BulletinService: Updating bulletin:', id);
    return await bulletinService.updateBulletin(id, bulletinData);
  }

  /**
   * Delete a bulletin using real API only
   * @param {String} id - Bulletin ID
   * @returns {Promise} - Promise with the delete response
   */
  async deleteBulletin(id) {
    console.log('BulletinService: Deleting bulletin:', id);
    return await bulletinService.deleteBulletin(id);
  }

  // Add reply to a bulletin message
  async addReply(bulletinId, replyData) {
    try {
      const response = await bulletinService.addReply(bulletinId, replyData);
      return response;
    } catch (error) {
      console.error('Error adding reply:', error);
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
      const response = await bulletinService.deleteReply(bulletinId, replyId);
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
      const response = await bulletinService.updateReply(bulletinId, replyId, replyData);
      return response;
    } catch (error) {
      console.error('Error updating reply:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new BulletinProxyService(); 