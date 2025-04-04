import api from '@/services/api';

/**
 * Service for managing bulletins (job postings and availability announcements)
 */
const bulletinService = {
  /**
   * Get all bulletins
   * @returns {Promise<any>} Promise with bulletins
   */
  async getAllBulletins(): Promise<any> {
    return api.get('/bulletins');
  },

  /**
   * Get bulletins created by the current user
   * @returns {Promise<any>} Promise with user's bulletins
   */
  async getMyBulletins(): Promise<any> {
    return api.get('/bulletins/my');
  },

  /**
   * Get a specific bulletin by ID
   * @param {string} id - Bulletin ID
   * @returns {Promise<any>} Promise with bulletin
   */
  async getBulletinById(id: string): Promise<any> {
    return api.get(`/bulletins/${id}`);
  },

  /**
   * Create a new bulletin
   * @param {any} bulletinData - Bulletin data
   * @returns {Promise<any>} Promise with created bulletin
   */
  async createBulletin(bulletinData: any): Promise<any> {
    return api.post('/bulletins', bulletinData);
  },

  /**
   * Update a bulletin
   * @param {string} id - Bulletin ID
   * @param {any} bulletinData - Updated bulletin data
   * @returns {Promise<any>} Promise with updated bulletin
   */
  async updateBulletin(id: string, bulletinData: any): Promise<any> {
    return api.put(`/bulletins/${id}`, bulletinData);
  },

  /**
   * Delete a bulletin
   * @param {string} id - Bulletin ID
   * @returns {Promise<any>} Promise with deletion result
   */
  async deleteBulletin(id: string): Promise<any> {
    return api.delete(`/bulletins/${id}`);
  },

  /**
   * Contact a bulletin author
   * @param {string} id - Bulletin ID
   * @param {any} contactData - Contact form data
   * @returns {Promise<any>} Promise with contact result
   */
  async contactBulletinAuthor(id: string, contactData: any): Promise<any> {
    return api.post(`/bulletins/${id}/contact`, contactData);
  },
  
  /**
   * Get doctor profile availability information
   * @returns {Promise<any>} Promise with doctor profile
   */
  async getProfileAvailability(): Promise<any> {
    return api.get('/doctor/profile');
  },
  
  /**
   * Update doctor profile availability information
   * @param {any} profileData - Updated profile data
   * @returns {Promise<any>} Promise with updated profile
   */
  async updateProfileAvailability(profileData: any): Promise<any> {
    return api.post('/doctor/profile', profileData);
  }
};

export default bulletinService;
