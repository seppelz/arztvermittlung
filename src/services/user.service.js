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
   * @param {Object} filters - Filter options like role, status, etc.
   * @param {Object} pagination - Pagination options like page, limit
   * @param {Object} sort - Sorting options
   * @returns {Promise} - Promise with the users
   */
  async getAllUsers(filters = {}, pagination = {}, sort = {}) {
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      
      // Add filter parameters
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.userType) queryParams.append('userType', filters.userType);
      if (filters.search) queryParams.append('search', filters.search);
      
      // Add pagination parameters
      if (pagination.page) queryParams.append('page', pagination.page);
      if (pagination.limit) queryParams.append('limit', pagination.limit);
      
      // Add sorting parameters
      if (sort.field) {
        const sortDirection = sort.direction === 'desc' ? '-' : '';
        queryParams.append('sort', `${sortDirection}${sort.field}`);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      console.log('Fetching users with query:', queryString);
      
      const response = await api.get(`/users${queryString}`);
      return response;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
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
    return api.patch(`/users/${userId}`, userData).catch(error => {
      console.error('Error updating user:', error);
      throw error;
    });
  }

  /**
   * Update user status (admin only)
   * @param {string} userId - User ID
   * @param {string} status - New status (active, inactive, suspended)
   * @returns {Promise} - Promise with the update response
   */
  async updateUserStatus(userId, status) {
    return api.patch(`/users/${userId}/status`, { status }).catch(error => {
      console.error('Error updating user status:', error);
      throw error;
    });
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