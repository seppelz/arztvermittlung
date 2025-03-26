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
    console.log('BulletinService: Fetching bulletins with params:', params);
    
    // No fallback to demo data - use real API only
    const response = await bulletinService.getAllBulletins(params);
    
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('BulletinService: API returned empty or invalid data');
      return { data: [] };
    }
    
    console.log('BulletinService: Successfully fetched from API, found', response.data.length, 'entries');
    return response;
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
}

// Export a singleton instance
export default new BulletinProxyService(); 