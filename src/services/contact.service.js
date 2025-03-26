import api from './api';

/**
 * Service for contact management related API calls
 */
class ContactService {
  /**
   * Get all contacts
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - Promise with contacts
   */
  async getAllContacts(params = {}) {
    try {
      const response = await api.get('/contacts', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a contact by ID
   * @param {String} id - Contact ID
   * @returns {Promise} - Promise with the contact
   */
  async getContactById(id) {
    try {
      const response = await api.get(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new contact message
   * @param {Object} contactData - Contact message data
   * @returns {Promise} - Promise with the created contact
   */
  async createContact(contactData) {
    try {
      const response = await api.post('/contacts', contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a contact
   * @param {String} id - Contact ID
   * @param {Object} contactData - Updated contact data
   * @returns {Promise} - Promise with the updated contact
   */
  async updateContact(id, contactData) {
    try {
      const response = await api.patch(`/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a contact
   * @param {String} id - Contact ID
   * @returns {Promise} - Promise with the delete response
   */
  async deleteContact(id) {
    try {
      const response = await api.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ContactService(); 