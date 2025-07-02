import type { ApiResponse } from '@/types';

// Define the structure for the interest request payload
interface CreateInterestPayload {
  targetType: 'job' | 'user';
  targetId: string;
}

// Define the structure for the expected response (adjust if backend returns the created interest)
interface InterestResponse {
  success: boolean;
  message: string;
  // Optional: include the created interest object if returned by the backend
  // interest?: any; 
}

/**
 * Sends a request to the backend to create an interest entry.
 * Requires authentication.
 */
async function createInterest(payload: CreateInterestPayload): Promise<ApiResponse<InterestResponse>> {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('[InterestService] No authentication token found');
    return {
      success: false,
      status: 401,
      message: 'Authentication required to show interest.',
      data: { success: false, message: 'Authentication required.' }
    };
  }

  try {
    // Dynamically import axios to avoid making it a hard dependency if not always needed
    const axios = (await import('axios')).default;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    console.log('[InterestService] Sending interest request to:', `${API_BASE_URL}/interests`);
    console.log('[InterestService] Payload:', payload);

    const response = await axios.post<InterestResponse>(
      `${API_BASE_URL}/interests`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true // Ensure cookies (like session) are sent
      }
    );

    console.log('[InterestService] Interest request successful:', response.data);

    // Assuming the backend response directly matches InterestResponse structure
    // If the backend wraps the data (e.g., { data: { success: true, ... } }), adjust accordingly.
    return {
      success: true,
      status: response.status,
      message: response.data.message || 'Interest registered successfully.',
      data: response.data 
    };

  } catch (error: any) {
    console.error('[InterestService] Error creating interest:', error);

    let errorMessage = 'Failed to register interest.';
    let statusCode = 500;

    if (error.response) {
      // Error response from the server
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      console.error('[InterestService] Server Error:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'No response from server. Please check your connection.';
      console.error('[InterestService] Network Error:', error.request);
    } else {
      // Error setting up the request
      errorMessage = error.message;
      console.error('[InterestService] Request Setup Error:', error.message);
    }

    return {
      success: false,
      status: statusCode,
      message: errorMessage,
      data: { success: false, message: errorMessage }
    };
  }
}

export default {
  createInterest
};
