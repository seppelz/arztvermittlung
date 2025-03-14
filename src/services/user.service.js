import api from './api';

/**
 * Service for user-related API calls
 */
class UserService {
  /**
   * Get the user profile
   * @returns {Promise} - Promise with the user profile
   */
  async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update the user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Promise with the update response
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/users/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Complete the user profile (extended profile details)
   * @param {Object} extendedProfileData - Extended profile data
   * @returns {Promise} - Promise with the update response
   */
  async completeProfile(extendedProfileData) {
    try {
      const response = await api.put('/users/complete-profile', extendedProfileData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   * @returns {Promise} - Promise with the users
   */
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID (admin only)
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with the user
   */
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user (admin only)
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise with the update response
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user (admin only)
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with the delete response
   */
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService(); 