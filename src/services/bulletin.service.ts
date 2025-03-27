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
    
    // Prepare reply data with proper type
    const replyData: Record<string, any> = {
      content: reply.content,
      privacyPolicyAccepted: true, // Always include this field, regardless of authentication status
      // Add status field to fix validation error
      status: 'active'
    };
    
    // Add authorization headers
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json'
    };
    
    if (isAuthenticated) {
      // For authenticated users
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('BulletinService: Added authorization token to headers');
        
        // Extract user ID from JWT token if not available in auth store
        if (!userId) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              if (payload && payload.id) {
                console.log('BulletinService: Extracted user ID from token:', payload.id);
                // Add userId to request data
                replyData.userId = payload.id;
              }
            }
          } catch (tokenError) {
            console.error('BulletinService: Error extracting user ID from token:', tokenError);
          }
        } else {
          // Use userId from auth store
          replyData.userId = userId;
        }
      } else {
        console.warn('BulletinService: No token found for authenticated user');
      }
      
      // Get user info from auth store
      const userName = authStore.userName;
      const userEmail = authStore.userEmail;
      
      // Include name and email for authenticated users to ensure backward compatibility
      if (userName) replyData.name = userName;
      if (userEmail) replyData.email = userEmail;
      
      console.log('BulletinService: Using authenticated user data:', { 
        name: replyData.name || 'Not available', 
        email: replyData.email || 'Not available',
        userId: replyData.userId || 'Not available'
      });
    } else {
      // For guest users: Add name, email, and session ID
      if (!reply.name || !reply.email) {
        console.error('BulletinService: Name and email are required for guest users');
        throw new Error('Name and email are required for guest users');
      }
      
      replyData.name = reply.name;
      replyData.email = reply.email;
      
      console.log('BulletinService: Using guest user mode with name:', reply.name);
      
      // Include session ID for guest users in both header and body
      const sessionId = getSessionId();
      if (sessionId) {
        replyData.sessionId = sessionId;
        headers['X-Session-Id'] = sessionId;
        console.log('BulletinService: Including session ID for tracking:', sessionId);
      } else {
        console.warn('BulletinService: No session ID available for guest user');
        // Create a new session ID if none exists
        const newSessionId = crypto.randomUUID();
        localStorage.setItem('sessionId', newSessionId);
        replyData.sessionId = newSessionId;
        headers['X-Session-Id'] = newSessionId;
        console.log('BulletinService: Created new session ID:', newSessionId);
      }
    }
    
    console.log('BulletinService: Final reply data:', { 
      content: replyData.content?.substring(0, 20) + '...',
      name: replyData.name || 'Not available',
      email: replyData.email || 'Not available',
      privacyPolicyAccepted: replyData.privacyPolicyAccepted,
      sessionId: replyData.sessionId || 'Not applicable (authenticated user)'
    });
    
    console.log('BulletinService: Request headers:', headers);
    
    // Set a timeout for the request to avoid hanging
    const response = await api.post(`/bulletin/${bulletinId}/replies`, replyData, {
      timeout: 15000, // 15 seconds timeout
      headers: headers
    });
    
    console.log('BulletinService: Reply added successfully');
    return response;
  } catch (error: any) {
    console.error('BulletinService: Error adding reply:', error.message);
    
    if (error.response) {
      console.error(`BulletinService: Server returned status ${error.response.status}`);
      console.error('BulletinService: Error response data:', error.response.data);
      
      const authStore = useAuthStore();
      const contextInfo = {
        isAuthenticated: authStore.isAuthenticated,
        hasUserId: !!authStore.userId,
        userId: authStore.userId,
        sessionId: localStorage.getItem('sessionId'),
        responseData: error.response.data
      };
      console.error('BulletinService: Error context:', contextInfo);
    }
    
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