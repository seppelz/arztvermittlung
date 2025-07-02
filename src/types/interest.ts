// src/types/interest.ts

// Generic API Response Wrapper (adjust based on your actual backend structure)
export interface ApiResponse<T> {
  data: T;
  // Add other potential fields like pagination, status code, etc., if applicable
}

// Represents a single interest record
export interface Interest {
  _id: string; // Or ObjectId if you use that type
  userId: string; // The user who showed interest
  targetType: 'job' | 'user'; // Type of target (job posting or user profile)
  targetId: string; // ID of the job posting or user profile
  createdAt: string; // Or Date
  updatedAt: string; // Or Date
  // Add any other relevant fields from your backend model
}

// Payload for creating a new interest
export interface CreateInterestPayload {
  targetType: 'job' | 'user';
  targetId: string;
}

// Response structure after creating an interest
export interface InterestResponse {
  success: boolean;
  message: string;
  interest?: Interest; // Optionally return the created interest object
}
