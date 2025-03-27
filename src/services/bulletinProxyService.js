import bulletinService from './bulletin.service';

/**
 * Proxy service for bulletin board operations
 * Acts as a wrapper around bulletinService for better error handling and caching
 */
class BulletinProxyService {
  constructor() {
    this.bulletinService = bulletinService;
  }

  /**
   * Get all bulletins with error handling
   */
  async getAllBulletins(params = {}) {
    try {
      return await this.bulletinService.getAllBulletins(params);
    } catch (error) {
      console.error('[BulletinProxyService] Error getting bulletins:', error);
      throw error;
    }
  }

  /**
   * Get a bulletin by ID with error handling
   */
  async getBulletinById(id) {
    try {
      return await this.bulletinService.getBulletinById(id);
    } catch (error) {
      console.error(`[BulletinProxyService] Error getting bulletin ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new bulletin with error handling
   */
  async createBulletin(bulletinData) {
    try {
      return await this.bulletinService.createBulletin(bulletinData);
    } catch (error) {
      console.error('[BulletinProxyService] Error creating bulletin:', error);
      throw error;
    }
  }

  /**
   * Update a bulletin with error handling
   */
  async updateBulletin(id, bulletinData) {
    try {
      return await this.bulletinService.updateBulletin(id, bulletinData);
    } catch (error) {
      console.error(`[BulletinProxyService] Error updating bulletin ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a bulletin with error handling
   */
  async deleteBulletin(id) {
    try {
      return await this.bulletinService.deleteBulletin(id);
    } catch (error) {
      console.error(`[BulletinProxyService] Error deleting bulletin ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add a reply to a bulletin with error handling
   */
  async addReply(bulletinId, replyData) {
    try {
      return await this.bulletinService.addReply(bulletinId, replyData);
    } catch (error) {
      console.error(`[BulletinProxyService] Error adding reply to bulletin ${bulletinId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a reply from a bulletin with error handling
   */
  async deleteReply(bulletinId, replyId) {
    try {
      return await this.bulletinService.deleteReply(bulletinId, replyId);
    } catch (error) {
      console.error(`[BulletinProxyService] Error deleting reply ${replyId} from bulletin ${bulletinId}:`, error);
      throw error;
    }
  }

  /**
   * Update a reply in a bulletin with error handling
   */
  async updateReply(bulletinId, replyId, content) {
    try {
      return await this.bulletinService.updateReply(bulletinId, replyId, content);
    } catch (error) {
      console.error(`[BulletinProxyService] Error updating reply ${replyId} in bulletin ${bulletinId}:`, error);
      throw error;
    }
  }

  /**
   * Get user's bulletins with error handling
   */
  async getUserBulletins(params = {}) {
    try {
      return await this.bulletinService.getUserBulletins(params);
    } catch (error) {
      console.error('[BulletinProxyService] Error getting user bulletins:', error);
      throw error;
    }
  }

  /**
   * Check if a user can edit a bulletin
   */
  canEditBulletin(bulletin) {
    return this.bulletinService.canEditBulletin(bulletin);
  }

  /**
   * Check if a user can edit a reply
   */
  canEditReply(reply) {
    return this.bulletinService.canEditReply(reply);
  }
}

export default new BulletinProxyService(); 