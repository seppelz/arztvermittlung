import api from './api';
import { ApiResponse, PaginatedResponse } from '@/types';

interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: 'new' | 'viewed' | 'responded';
  createdAt?: string;
  updatedAt?: string;
}

interface ContactResponse {
  message: string;
  success: boolean;
}

/**
 * Service for handling contact messages
 */
class ContactService {
  /**
   * Endpoint for contact API
   */
  endpoint = '/contact';

  /**
   * Send contact message
   * @param {ContactMessage} messageData Contact message data
   * @returns {Promise<ApiResponse<ContactResponse>>} Promise with response
   */
  sendMessage(messageData: ContactMessage): Promise<ApiResponse<ContactResponse>> {
    return api.post(`${this.endpoint}`, messageData);
  }

  /**
   * Get all contact messages
   * @param {number} page Page number
   * @param {number} limit Items per page
   * @returns {Promise<PaginatedResponse<ContactMessage>>} Promise with paginated messages
   */
  getAllMessages(page = 1, limit = 10): Promise<PaginatedResponse<ContactMessage>> {
    return api.get(`${this.endpoint}?page=${page}&limit=${limit}`);
  }

  /**
   * Get contact message by ID
   * @param {string} id Message ID
   * @returns {Promise<ApiResponse<ContactMessage>>} Promise with message details
   */
  getMessageById(id: string): Promise<ApiResponse<ContactMessage>> {
    return api.get(`${this.endpoint}/${id}`);
  }

  /**
   * Update contact message status
   * @param {string} id Message ID
   * @param {string} status New status
   * @returns {Promise<ApiResponse<ContactMessage>>} Promise with updated message
   */
  updateMessageStatus(id: string, status: 'new' | 'viewed' | 'responded'): Promise<ApiResponse<ContactMessage>> {
    return api.put(`${this.endpoint}/${id}/status`, { status });
  }

  /**
   * Delete contact message
   * @param {string} id Message ID
   * @returns {Promise<ApiResponse<{ success: boolean }>>} Promise with success status
   */
  deleteMessage(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.delete(`${this.endpoint}/${id}`);
  }
}

export default new ContactService(); 