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
  } catch (error: any) {
    console.error(`[BulletinProxyService] Error adding reply to bulletin ${bulletinId}:`, error);
    
    // Enhanced error handling with more specific error messages
    let errorMessage = 'Error adding reply';
    let statusCode = 500;
    
    if (error.message.includes('angemeldet sein')) {
      errorMessage = 'Sie müssen angemeldet sein, um Antworten zu verfassen.';
      statusCode = 401;
    } else if (error.message.includes('Validierungsfehler')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('Server-Fehler')) {
      errorMessage = error.message;
      statusCode = 500;
    } else if (error.response) {
      // Handle axios error responses
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.data?.error || error.message;
    }
    
    return {
      data: null as any,
      success: false,
      status: statusCode,
      message: errorMessage
    };
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
  } catch (error: any) {
    console.error(`[BulletinProxyService] Error deleting reply ${replyId} from bulletin ${bulletinId}:`, error);
    
    // Enhanced error handling
    let errorMessage = 'Error deleting reply';
    let statusCode = 500;
    
    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.data?.error || error.message;
      
      if (statusCode === 404) {
        errorMessage = 'Die Antwort wurde nicht gefunden oder wurde bereits gelöscht.';
      } else if (statusCode === 403) {
        errorMessage = 'Sie haben keine Berechtigung, diese Antwort zu löschen.';
      }
    }
    
    return {
      data: null as any,
      success: false,
      status: statusCode,
      message: errorMessage
    };
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
  } catch (error: any) {
    console.error(`[BulletinProxyService] Error updating reply ${replyId} in bulletin ${bulletinId}:`, error);
    
    // Enhanced error handling
    let errorMessage = 'Error updating reply';
    let statusCode = 500;
    
    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.data?.error || error.message;
      
      if (statusCode === 404) {
        errorMessage = 'Die Antwort wurde nicht gefunden.';
      } else if (statusCode === 403) {
        errorMessage = 'Sie haben keine Berechtigung, diese Antwort zu bearbeiten.';
      } else if (statusCode === 400) {
        errorMessage = 'Die Antwort enthält ungültige Daten.';
      }
    }
    
    return {
      data: null as any,
      success: false,
      status: statusCode,
      message: errorMessage
    };
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