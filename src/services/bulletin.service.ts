import api from './api';
import { useAuthStore } from '@/stores/auth';
import { Bulletin, BulletinReply, BulletinParams } from '@/types';

/**
 * Response data structure
 */
export interface ResponseWithData<T> {
  success?: boolean;
  data: T;
  message?: string;
}

// Variable to track if guest session has been initialized
let guestSessionInitialized = false;

// Initialize guest session if needed
function initializeGuestSession(): void {
  if (guestSessionInitialized) return;
  
  try {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated && !localStorage.getItem('sessionId')) {
      const sessionId = crypto.randomUUID();
      localStorage.setItem('sessionId', sessionId);
    }
    guestSessionInitialized = true;
  } catch (error) {
    console.error('Failed to initialize guest session:', error);
    // Continue without initialization if the auth store is not ready
  }
}

// Get current session ID
function getSessionId(): string | null {
  // Ensure guest session is initialized when this function is called
  if (!guestSessionInitialized) {
    initializeGuestSession();
  }
  
  try {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated) {
      return null;
    }
  } catch (error) {
    console.error('Error accessing auth store:', error);
    // If we can't access the auth store, assume guest user
  }
  return localStorage.getItem('sessionId');
}

/**
 * Get all bulletins
 * @param params - Query parameters for filtering
 * @returns Promise with bulletins
 */
async function getAllBulletins(params: BulletinParams = {}): Promise<ResponseWithData<Bulletin[]>> {
  try {
    console.log('BulletinService: Fetching bulletins with params:', params);
    
    // Always use the /bulletin endpoint for consistency
    const endpoint = '/bulletin';
    
    // Maximum timeout for API calls
    const TIMEOUT = 15000;
    
    const response = await api.get(endpoint, { 
      params,
      timeout: TIMEOUT,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log(`BulletinService: Response received successfully from ${endpoint}`);
    console.log('BulletinService: Response structure:', { 
      status: response.status,
      hasData: !!response.data,
      dataType: response.data ? typeof response.data : 'undefined',
      isArray: response.data ? Array.isArray(response.data) : false,
      hasNestedData: response.data && response.data.data ? true : false
    });
    
    // Process response data
    if (!response.data) {
      console.warn('BulletinService: Empty response data');
      return { data: [] };
    }
    
    // Return appropriate data structure
    if (Array.isArray(response.data)) {
      console.log('BulletinService: Response is an array with', response.data.length, 'items');
      return { data: response.data };
    }
    
    if (response.data.data && Array.isArray(response.data.data)) {
      console.log('BulletinService: Found nested data array with', response.data.data.length, 'items');
      return response.data;
    }
    
    console.warn('BulletinService: Unexpected response format', response.data);
    return { data: [] };
  } catch (error: any) {
    console.error('BulletinService: Error fetching bulletins:', error);
    
    // Attempt to extract meaningful error info
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    };
    
    console.error('BulletinService: Error details:', errorInfo);
    
    if (error.response?.status === 401) {
      console.error('BulletinService: Authentication error - user may not be logged in');
    } else if (error.response?.status === 403) {
      console.error('BulletinService: Authorization error - user may not have permission');
    } else if (error.response?.status === 404) {
      console.error('BulletinService: API endpoint not found - incorrect path or missing route');
    } else if (error.response?.status === 500) {
      console.error('BulletinService: Server error - check backend logs for details');
      console.error('BulletinService: Response from server:', error.response?.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('BulletinService: Request timeout - server took too long to respond');
    } else if (error.message.includes('Network Error')) {
      console.error('BulletinService: Network error - CORS issue or server unreachable');
    }
    
    // Re-throw with more context
    throw error;
  }
}

/**
 * Get a bulletin by ID
 * @param id - Bulletin ID
 * @returns Promise with the bulletin
 */
async function getBulletinById(id: string): Promise<Bulletin> {
  try {
    console.log(`BulletinService: Getting bulletin with ID ${id}`);
    const response = await api.get(`/bulletin/${id}`);
    return response.data;
  } catch (error) {
    console.error(`BulletinService: Error getting bulletin with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new bulletin
 * @param bulletinData - Bulletin data
 * @returns Promise with the created bulletin
 */
async function createBulletin(bulletinData: Partial<Bulletin>): Promise<Bulletin> {
  try {
    console.log('BulletinService: Creating new bulletin:', bulletinData);
    const authStore = useAuthStore();
    
    // Process the data to ensure dates are properly formatted
    const processedData = { ...bulletinData };
    
    // Ensure startDate is properly set for job listings
    if ((bulletinData.messageType === 'Angebot' || bulletinData.messageType === 'Gesuch') && bulletinData.startDate) {
      if (typeof bulletinData.startDate === 'string') {
        processedData.startDate = new Date(bulletinData.startDate);
      }
    } else if ((bulletinData.messageType === 'Angebot' || bulletinData.messageType === 'Gesuch') && !bulletinData.startDate) {
      processedData.startDate = new Date();
    }
    
    const response = await api.post('/bulletin', {
      ...processedData,
      userId: authStore.isAuthenticated ? authStore.userId : null,
      sessionId: getSessionId()
    });
    console.log('BulletinService: Bulletin created successfully:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('BulletinService: Error creating bulletin:', error);
    
    // Type guard for errors with 'response' property
    if (error && typeof error === 'object' && 'response' in error) {
      const errorObj = error as { response?: unknown; message?: string };
      console.error('BulletinService: Error details:', errorObj.response || errorObj.message);
    }
    
    throw error;
  }
}

/**
 * Update a bulletin
 * @param id - Bulletin ID
 * @param bulletinData - Updated bulletin data
 * @returns Promise with the updated bulletin
 */
async function updateBulletin(id: string, bulletinData: Partial<Bulletin>): Promise<Bulletin> {
  try {
    console.log(`BulletinService: Updating bulletin ${id}:`, bulletinData);
    
    // Process the data to ensure dates are properly formatted
    const processedData = { ...bulletinData };
    
    // Ensure startDate is properly set for job listings if provided
    if (bulletinData.startDate) {
      // Ensure startDate is a Date object (if string, convert to Date)
      if (typeof bulletinData.startDate === 'string') {
        processedData.startDate = new Date(bulletinData.startDate);
      }
      
      console.log('BulletinService: Using startDate for update:', processedData.startDate);
    }
    
    const response = await api.patch(`/bulletin/${id}`, processedData);
    console.log(`BulletinService: Bulletin ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(`BulletinService: Error updating bulletin ${id}:`, error);
    
    // Type guard for errors with 'response' property
    if (error && typeof error === 'object' && 'response' in error) {
      const errorObj = error as { response?: unknown; message?: string };
      console.error('BulletinService: Error details:', errorObj.response || errorObj.message);
    }
    
    throw error;
  }
}

/**
 * Delete a bulletin
 * @param id - Bulletin ID
 * @returns Promise with the deleted bulletin
 */
async function deleteBulletin(id: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`BulletinService: Deleting bulletin ${id}`);
    const response = await api.delete(`/bulletin/${id}`);
    console.log(`BulletinService: Bulletin ${id} deleted successfully`);
    return response.data;
  } catch (error) {
    console.error(`BulletinService: Error deleting bulletin ${id}:`, error);
    throw error;
  }
}

/**
 * Add a reply to a bulletin
 * @param bulletinId - Bulletin ID
 * @param reply - Reply data
 * @returns Promise with the updated bulletin
 */
async function addReply(bulletinId: string, reply: Partial<BulletinReply>): Promise<any> {
  try {
    console.log('BulletinService: Adding reply to bulletin', bulletinId);
    const authStore = useAuthStore();
    
    // Get auth status and user info safely
    const isAuthenticated = authStore.isAuthenticated;
    const userId = authStore.userId;
    
    console.log('BulletinService: Auth status:', isAuthenticated ? 'Authenticated' : 'Guest');
    console.log('BulletinService: User ID from auth store:', userId || 'Not available');
    
    // Enforce authentication - reject guest access immediately
    if (!isAuthenticated) {
      console.error('BulletinService: Authentication required to add replies');
      throw new Error('Sie müssen angemeldet sein, um Antworten zu verfassen.');
    }
    
    // Get token for authenticated users
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('BulletinService: No token found for authenticated user');
      throw new Error('Authentifizierungstoken nicht gefunden. Bitte melden Sie sich erneut an.');
    }

    // Try to extract user ID from token first to ensure we have it
    let userIdToUse = userId;
    if (!userIdToUse) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload && payload.id) {
            console.log('BulletinService: Extracted user ID from token:', payload.id);
            userIdToUse = payload.id;
          }
        }
      } catch (tokenError) {
        console.error('BulletinService: Error extracting user ID from token:', tokenError);
      }
    }

    // Get user info from auth store
    const userName = authStore.userName || 'Angemeldeter Benutzer';
    const userEmail = authStore.userEmail || '';
    
    // Helper function to create request headers
    const createHeaders = () => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    // Create initial headers
    const headers = createHeaders();
    
    // STEP 1: First check if the bulletin exists and is valid
    try {
      console.log('BulletinService: Fetching bulletin first to check status');
      const bulletinResponse = await api.get(`/bulletin/${bulletinId}`, {
        headers: createHeaders()
      });
      
      const bulletinData = bulletinResponse.data;
      console.log('BulletinService: Bulletin data retrieved', {
        id: bulletinData._id,
        status: bulletinData.status,
        hasPrivacyPolicy: !!bulletinData.privacyPolicyAccepted
      });
      
      // Check if bulletin is valid for replies
      if (bulletinData.status !== 'active') {
        console.error('BulletinService: Cannot reply to non-active bulletin');
        throw new Error(`Antworten sind für diesen Beitrag nicht möglich. Status: ${bulletinData.status}`);
      }
      
      // Check if bulletin has privacyPolicyAccepted
      if (!bulletinData.privacyPolicyAccepted) {
        console.log('BulletinService: Bulletin missing privacyPolicyAccepted, fixing before reply');
        
        // Update the bulletin first to fix the privacy policy field
        try {
          await api.patch(`/bulletin/${bulletinId}`, {
            privacyPolicyAccepted: true
          }, {
            headers: createHeaders()
          });
          console.log('BulletinService: Fixed bulletin privacy policy field');
        } catch (updateError) {
          console.error('BulletinService: Failed to update bulletin privacy policy:', updateError);
          // Continue with reply attempt even if update failed
        }
      }
    } catch (fetchError) {
      console.error('BulletinService: Error fetching bulletin:', fetchError);
      // If we can't fetch the bulletin, we'll still try to add the reply
    }
    
    // STEP 2: Now add the reply with the necessary fields
    console.log('BulletinService: Proceeding with reply submission');
    
    // Prepare reply data - include only fields the backend explicitly needs
    const replyData: Record<string, any> = {
      content: reply.content,
      name: userName,
      email: userEmail,
      privacyPolicyAccepted: true
    };
    
    console.log('BulletinService: Using authenticated user data:', { 
      name: replyData.name,
      email: replyData.email
    });
    
    // Log what we're sending
    const logData = { ...replyData };
    if (logData.content) {
      logData.content = logData.content.substring(0, 20) + '...';
    }
    console.log('BulletinService: Final reply data:', logData);
    
    // Make the request to add the reply
    const response = await api.post(`/bulletin/${bulletinId}/replies`, replyData, {
      timeout: 15000,
      headers: headers
    });
    
    console.log('BulletinService: Reply added successfully');
    return response;
  } catch (error: any) {
    console.error('BulletinService: Error adding reply:', error.message);
    
    // Check if error contains nested response data
    const responseData = error.response?.data;
    const status = error.response?.status;
    
    if (status && responseData) {
      console.error(`BulletinService: Server returned status ${status}`);
      console.error('BulletinService: Error response data:', responseData);
      
      // Extract error messages from MongoDB validation errors
      if (status === 400 && responseData.error && responseData.error.includes('validation')) {
        console.error('BulletinService: Validation error:', responseData.error);
        
        // Handle specific validation errors
        if (responseData.error.includes('privacyPolicyAccepted')) {
          throw new Error('Validierungsfehler: Die Datenschutzerklärung muss akzeptiert werden, bitte wenden Sie sich an den Administrator.');
        }
        if (responseData.error.includes('status')) {
          throw new Error('Validierungsfehler: Der Status des Eintrags ist ungültig. Bitte kontaktieren Sie den Administrator.');
        }
        
        throw new Error('Validierungsfehler: ' + responseData.error);
      }
      
      // Standard HTTP status code handling
      if (status === 401) {
        throw new Error('Sie sind nicht angemeldet oder Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.');
      } else if (status === 403) {
        throw new Error('Sie haben keine Berechtigung, diese Aktion durchzuführen.');
      } else if (status === 404) {
        throw new Error('Die Nachricht wurde nicht gefunden oder wurde bereits gelöscht.');
      } else if (status === 500) {
        throw new Error('Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      } else if (status === 400) {
        throw new Error('Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben.');
      }
    }
    
    // Generic error if no specific handling above
    throw error;
  }
}

/**
 * Delete a reply from a bulletin
 * @param bulletinId - Bulletin ID
 * @param replyId - Reply ID to delete
 * @returns Promise with the delete response
 */
async function deleteReply(bulletinId: string, replyId: string): Promise<any> {
  try {
    console.log('BulletinService: Deleting reply', replyId, 'from bulletin', bulletinId);
    const authStore = useAuthStore();
    
    // Set up headers with session ID for guest users
    const headers: Record<string, string> = {};
    
    // Add session ID to headers for guest users
    if (!authStore.isAuthenticated) {
      const sessionId = getSessionId();
      if (sessionId) {
        headers['X-Session-Id'] = sessionId;
        console.log('BulletinService: Using guest session ID for delete:', sessionId);
      }
    }
    
    const response = await api.delete(`/bulletin/${bulletinId}/replies/${replyId}`, { headers });
    
    console.log('BulletinService: Reply deleted successfully');
    return response.data;
  } catch (error) {
    console.error('BulletinService: Error deleting reply:', error);
    throw error;
  }
}

/**
 * Update a reply in a bulletin
 * @param bulletinId - Bulletin ID
 * @param replyId - Reply ID to update
 * @param content - Updated reply content
 * @returns Promise with the update response
 */
async function updateReply(bulletinId: string, replyId: string, content: string): Promise<any> {
  try {
    console.log('BulletinService: Updating reply', replyId, 'in bulletin', bulletinId);
    const authStore = useAuthStore();
    
    // Set up headers with session ID for guest users
    const headers: Record<string, string> = {};
    const dataToSend = { content };
    
    // Add session ID for guest users
    if (!authStore.isAuthenticated) {
      const sessionId = getSessionId();
      if (sessionId) {
        headers['X-Session-Id'] = sessionId;
        console.log('BulletinService: Using guest session ID for update:', sessionId);
      }
    }
    
    const response = await api.patch(`/bulletin/${bulletinId}/replies/${replyId}`, dataToSend, { headers });
    
    console.log('BulletinService: Reply updated successfully');
    return response.data;
  } catch (error) {
    console.error('BulletinService: Error updating reply:', error);
    throw error;
  }
}

/**
 * Get bulletins for the current user
 * @param params - Query parameters for filtering
 * @returns Promise with user bulletins
 */
async function getUserBulletins(params: BulletinParams = {}): Promise<ResponseWithData<Bulletin[]>> {
  try {
    console.log('BulletinService: Getting user bulletins with params:', params);
    const response = await api.get('/bulletin/user', { params });
    return response.data;
  } catch (error) {
    console.error('BulletinService: Error getting user bulletins:', error);
    throw error;
  }
}

/**
 * Check if the current user can edit a bulletin
 * @param bulletin - The bulletin to check
 * @returns true if the user can edit the bulletin
 */
function canEditBulletin(bulletin: Bulletin): boolean {
  const authStore = useAuthStore();
  
  // Admin can always edit
  if (authStore.isAdmin) return true;
  
  // Check if user owns this bulletin
  if (authStore.isAuthenticated && bulletin.userId === authStore.userId) return true;
  
  // Check session ID for guest users
  const sessionId = getSessionId();
  return !!sessionId && sessionId === bulletin.sessionId;
}

/**
 * Check if the current user can edit a reply
 * @param reply - The reply to check
 * @returns true if the user can edit the reply
 */
function canEditReply(reply: BulletinReply): boolean {
  const authStore = useAuthStore();
  
  // Admin can always edit
  if (authStore.isAdmin) return true;
  
  // Check if user owns this reply
  if (authStore.isAuthenticated && reply.userId === authStore.userId) return true;
  
  // Check session ID for guest users
  const sessionId = getSessionId();
  return !!sessionId && sessionId === reply.sessionId;
}

// Export service functions
export {
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
  getSessionId
}; 