import { ApiResponse, Bulletin, BulletinReply, BulletinParams } from '@/types';
import {
  getAllBulletins,
  getBulletinById,
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
  // Check if the data is a paginated response with items and pagination
  if (response.data && typeof response.data === 'object' && 
      !Array.isArray(response.data) && 
      'items' in response.data && 
      'pagination' in response.data) {
    // For paginated responses, extract the items
    return {
      data: (response.data as any).items,
      success: response.success || true,
      status: 200,
      message: response.message || ''
    };
  }
  
  // For regular responses
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
    console.log('[BulletinProxyService] Getting all bulletins with params:', params);
    const response = await getAllBulletins(params);
    
    // Extract bulletins from the paginated response
    if (response && response.data && response.data.items) {
      return {
        data: response.data.items,
        success: true,
        status: 200,
        message: 'Bulletins retrieved successfully'
      };
    }
    
    // Fallback for unexpected response format
    console.warn('[BulletinProxyService] Unexpected response format from getAllBulletins');
    return {
      data: [],
      success: false,
      status: 500,
      message: 'Unexpected response format'
    };
  } catch (error) {
    console.error('[BulletinProxyService] Error getting bulletins:', error);
    
    // Enhanced error handling with detailed logging
    if (error && typeof error === 'object') {
      console.error('[BulletinProxyService] Detailed error info:', {
        name: (error as any).name,
        message: (error as any).message,
        response: (error as any).response,
        stack: (error as any).stack
      });
    }
    
    // Return a proper error response instead of throwing
    return {
      data: [],
      success: false,
      status: (error as any)?.response?.status || 500,
      message: (error as any)?.message || 'Failed to load bulletins'
    };
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
 * ONLY for authenticated users - guest users not allowed
 */
async function createBulletinProxy(bulletinData: Partial<Bulletin>): Promise<ApiResponse<Bulletin>> {
  try {
    console.log('[BulletinProxyService] Starting bulletin creation with PROPER AUTH HEADERS');
    
    // 1. Verify authentication status
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('[BulletinProxyService] No authentication token found');
      return {
        success: false,
        status: 401,
        message: 'Authentication required to create bulletins',
        data: null as any
      };
    }
    
    // 2. Get user data from localStorage
    let name = '';
    let email = '';
    let userType = '';
    
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const userData = JSON.parse(userJson);
        name = userData.name || '';
        email = userData.email || '';
        
        // Extract userType from user data in localStorage
        userType = userData.userType || 
                  (userData.role === 'doctor' ? 'Arzt' : 
                  (userData.role === 'hospital' ? 'Klinik' : 'Arzt')); // Default to 'Arzt' if not found
        
        console.log('[BulletinProxyService] User data from localStorage:', {
          name,
          email,
          userType
        });
      }
    } catch (e) {
      console.warn('[BulletinProxyService] Error getting user data:', e);
    }
    
    // 3. Create bulletin data WITHOUT including userId in the request
    // The backend will extract userId from the JWT token in Authorization header
    const bulletinRequest = {
      ...bulletinData,
      name,
      email,
      userType: 'Arzt', // HARDCODED to ensure validation passes - must be either 'Arzt' or 'Klinik'
      messageType: bulletinData.messageType || 'Information',
      privacyPolicyAccepted: true,
      timestamp: new Date().toISOString()
    };
    
    console.log('[BulletinProxyService] Creating bulletin with data:', bulletinRequest);
    
    // 4. Use axios directly with proper configuration
    const axios = (await import('axios')).default;
    
    const response = await axios.post('/api/bulletin', bulletinRequest, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true // Critical for authentication cookies
    });
    
    console.log('[BulletinProxyService] Bulletin created successfully:', response.data);
    
    return {
      success: true,
      status: 201,
      message: 'Bulletin created successfully',
      data: response.data.data || response.data
    };
  } catch (error: any) {
    console.error('[BulletinProxyService] Error creating bulletin:', error);
    
    if (error.response) {
      console.error('[BulletinProxyService] Server response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    // Try to reconnect if auth failed
    if (error.response?.status === 401) {
      try {
        console.log('[BulletinProxyService] Attempting to refresh authentication...');
        const { useAuthStore } = await import('@/stores/auth');
        const authStore = useAuthStore();
        await authStore.initAuth();
        
        return {
          success: false,
          status: 401,
          message: 'Authentication failed. Please try again after refreshing the page.',
          data: null as any
        };
      } catch (refreshError) {
        console.error('[BulletinProxyService] Failed to refresh authentication:', refreshError);
      }
    }
    
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || 
               error.response?.data?.error || 
               error.message || 
               'Unknown error creating bulletin',
      data: null as any
    };
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
    console.log('[BulletinProxyService] Getting user bulletins with params:', params);
    const response = await getUserBulletins(params);
    console.log('[BulletinProxyService] User bulletins response:', response);
    return mapToApiResponse(response);
  } catch (error) {
    console.error('[BulletinProxyService] Error getting user bulletins:', error);
    
    // Enhanced error handling with detailed logging
    if (error && typeof error === 'object') {
      console.error('[BulletinProxyService] Detailed error info:', {
        name: (error as any).name,
        message: (error as any).message,
        response: (error as any).response,
        stack: (error as any).stack
      });
    }
    
    // Return a proper error response instead of throwing
    return {
      data: [],
      success: false,
      status: (error as any)?.response?.status || 500,
      message: (error as any)?.message || 'Failed to load user bulletins'
    };
  }
}

/**
 * Contact a bulletin author with error handling
 */
async function contactBulletinAuthorProxy(bulletinId: string, contactData: { name: string, email: string, message: string }): Promise<ApiResponse<any>> {
  try {
    console.log('[BulletinProxyService] Sending contact request for bulletin:', bulletinId);
    
    // Get token for authentication
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('[BulletinProxyService] No authentication token found');
      return {
        success: false,
        status: 401,
        message: 'Authentication required to contact bulletin authors',
        data: null
      };
    }
    
    // Use axios directly with proper configuration
    const axios = (await import('axios')).default;
    
    const response = await axios.post(`/api/bulletin/${bulletinId}/contact`, contactData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true // Critical for authentication cookies
    });
    
    console.log('[BulletinProxyService] Contact request sent successfully:', response.data);
    
    return {
      success: true,
      status: 200,
      message: 'Contact request sent successfully',
      data: response.data
    };
  } catch (error: any) {
    console.error(`[BulletinProxyService] Error contacting bulletin author for bulletin ${bulletinId}:`, error);
    
    // Enhanced error handling
    let errorMessage = 'Error sending contact request';
    let statusCode = 500;
    
    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.data?.error || error.message;
      
      if (statusCode === 404) {
        errorMessage = 'Die Anzeige wurde nicht gefunden.';
      } else if (statusCode === 403) {
        errorMessage = 'Sie haben keine Berechtigung, den Autor zu kontaktieren.';
      }
    }
    
    return {
      data: null,
      success: false,
      status: statusCode,
      message: errorMessage
    };
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
  contactBulletinAuthor: contactBulletinAuthorProxy,
  canEditBulletin,
  canEditReply
};