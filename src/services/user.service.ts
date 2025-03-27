import api from './api';
import { User, ApiResponse } from '@/types';

/**
 * Service for handling user operations
 */
class UserService {
  /**
   * Endpoint for user API
   */
  endpoint = '/users';

  /**
   * Get all users
   * @returns {Promise<ApiResponse<User[]>>} Promise with all users
   */
  getAllUsers(): Promise<ApiResponse<User[]>> {
    return api.get(`${this.endpoint}`);
  }

  /**
   * Get user by ID
   * @param {string} id User ID
   * @returns {Promise<ApiResponse<User>>} Promise with user details
   */
  getUserById(id: string): Promise<ApiResponse<User>> {
    return api.get(`${this.endpoint}/${id}`);
  }

  /**
   * Update user
   * @param {string} id User ID
   * @param {Partial<User>} userData Updated user data
   * @returns {Promise<ApiResponse<User>>} Promise with updated user
   */
  updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return api.put(`${this.endpoint}/${id}`, userData);
  }

  /**
   * Get user profile
   * @returns {Promise<ApiResponse<User>>} Promise with user profile
   */
  getProfile(): Promise<ApiResponse<User>> {
    return api.get(`${this.endpoint}/profile`);
  }

  /**
   * Delete user
   * @param {string} id User ID
   * @returns {Promise<ApiResponse<{ success: boolean }>>} Promise with success status
   */
  deleteUser(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Update user profile
   * @param {Partial<User>} profileData Updated profile data
   * @returns {Promise<ApiResponse<User>>} Promise with updated profile
   */
  updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    return api.put(`${this.endpoint}/profile`, profileData);
  }

  /**
   * Change user password
   * @param {string} currentPassword Current password
   * @param {string} newPassword New password
   * @returns {Promise<ApiResponse<{ success: boolean }>>} Promise with success status
   */
  changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.put(`${this.endpoint}/password`, { currentPassword, newPassword });
  }

  /**
   * Upload profile image
   * @param {FormData} formData Form data with image
   * @returns {Promise<ApiResponse<{ imageUrl: string }>>} Promise with image URL
   */
  uploadProfileImage(formData: FormData): Promise<ApiResponse<{ imageUrl: string }>> {
    return api.post(`${this.endpoint}/profile/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Get user statistics
   * @returns {Promise<ApiResponse<{ totalUsers: number, doctors: number, hospitals: number }>>} Promise with user statistics
   */
  getUserStats(): Promise<ApiResponse<{ totalUsers: number, doctors: number, hospitals: number }>> {
    return api.get(`${this.endpoint}/stats`);
  }
}

export default new UserService(); 