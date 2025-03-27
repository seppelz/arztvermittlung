import { ApiResponse, Bulletin, BulletinReply, BulletinParams } from '@/types';
import {
  getAllBulletins,
  getBulletinById,
  createBulletin,
  updateBulletin,
  deleteBulletin,
  addReply,
  deleteReply,
  updateReply,
  getUserBulletins,
  canEditBulletin,
  canEditReply,
  ResponseWithData
} from './bulletin.service';

// Map the ResponseWithData to ApiResponse for consistency
function mapToApiResponse<T>(response: ResponseWithData<T>): ApiResponse<T> {
  return {
    data: response.data,
    success: response.success || true,
    status: 200,
    message: response.message || ''
  };
}

/**
 * Get all bulletins with error handling
 */
async function getAllBulletinsProxy(params: BulletinParams = {}): Promise<ApiResponse<Bulletin[]>> {
  try {
    const response = await getAllBulletins(params);
    return mapToApiResponse(response);
  } catch (error) {
    console.error('[BulletinProxyService] Error getting bulletins:', error);
    throw error;
  }
}

/**
 * Get a bulletin by ID with error handling
 */
async function getBulletinByIdProxy(id: string): Promise<ApiResponse<Bulletin>> {
  try {
    const bulletin = await getBulletinById(id);
    return {
      data: bulletin,
      success: true,
      status: 200,
      message: 'Bulletin retrieved successfully'
    };
  } catch (error) {
    console.error(`[BulletinProxyService] Error getting bulletin ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new bulletin with error handling
 */
async function createBulletinProxy(bulletinData: Partial<Bulletin>): Promise<ApiResponse<Bulletin>> {
  try {
    const bulletin = await createBulletin(bulletinData);
    return {
      data: bulletin,
      success: true,
      status: 201,
      message: 'Bulletin created successfully'
    };
  } catch (error) {
    console.error('[BulletinProxyService] Error creating bulletin:', error);
    throw error;
  }
}

/**
 * Update a bulletin with error handling
 */
async function updateBulletinProxy(id: string, bulletinData: Partial<Bulletin>): Promise<ApiResponse<Bulletin>> {
  try {
    const bulletin = await updateBulletin(id, bulletinData);
    return {
      data: bulletin,
      success: true,
      status: 200,
      message: 'Bulletin updated successfully'
    };
  } catch (error) {
    console.error(`[BulletinProxyService] Error updating bulletin ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a bulletin with error handling
 */
async function deleteBulletinProxy(id: string): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const result = await deleteBulletin(id);
    return {
      data: { success: result.success },
      success: result.success,
      status: 200,
      message: result.message
    };
  } catch (error) {
    console.error(`[BulletinProxyService] Error deleting bulletin ${id}:`, error);
    throw error;
  }
}

/**
 * Add a reply to a bulletin with error handling
 */
async function addReplyProxy(bulletinId: string, replyData: Partial<BulletinReply>): Promise<ApiResponse<Bulletin>> {
  try {
    const bulletin = await addReply(bulletinId, replyData);
    return {
      data: bulletin,
      success: true,
      status: 200,
      message: 'Reply added successfully'
    };
  } catch (error) {
    console.error(`[BulletinProxyService] Error adding reply to bulletin ${bulletinId}:`, error);
    throw error;
  }
}

/**
 * Delete a reply from a bulletin with error handling
 */
async function deleteReplyProxy(bulletinId: string, replyId: string): Promise<ApiResponse<Bulletin>> {
  try {
    const bulletin = await deleteReply(bulletinId, replyId);
    return {
      data: bulletin,
      success: true,
      status: 200,
      message: 'Reply deleted successfully'
    };
  } catch (error) {
    console.error(`[BulletinProxyService] Error deleting reply ${replyId} from bulletin ${bulletinId}:`, error);
    throw error;
  }
}

/**
 * Update a reply in a bulletin with error handling
 */
async function updateReplyProxy(bulletinId: string, replyId: string, content: string): Promise<ApiResponse<Bulletin>> {
  try {
    const bulletin = await updateReply(bulletinId, replyId, content);
    return {
      data: bulletin,
      success: true,
      status: 200,
      message: 'Reply updated successfully'
    };
  } catch (error) {
    console.error(`[BulletinProxyService] Error updating reply ${replyId} in bulletin ${bulletinId}:`, error);
    throw error;
  }
}

/**
 * Get user's bulletins with error handling
 */
async function getUserBulletinsProxy(params: BulletinParams = {}): Promise<ApiResponse<Bulletin[]>> {
  try {
    const response = await getUserBulletins(params);
    return mapToApiResponse(response);
  } catch (error) {
    console.error('[BulletinProxyService] Error getting user bulletins:', error);
    throw error;
  }
}

export default {
  getAllBulletins: getAllBulletinsProxy,
  getBulletinById: getBulletinByIdProxy,
  createBulletin: createBulletinProxy,
  updateBulletin: updateBulletinProxy,
  deleteBulletin: deleteBulletinProxy,
  addReply: addReplyProxy,
  deleteReply: deleteReplyProxy,
  updateReply: updateReplyProxy,
  getUserBulletins: getUserBulletinsProxy,
  canEditBulletin,
  canEditReply
}; 