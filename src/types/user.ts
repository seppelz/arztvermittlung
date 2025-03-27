/**
 * User interface definition
 * Contains common properties for user entities in the system
 */
export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string; // Only used for registration/login, not stored in state
  role?: 'user' | 'admin' | 'doctor' | 'hospital';
  userType?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  specialty?: string;
  profileComplete?: boolean;
  profileImage?: string;
  description?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // For any additional properties
}

/**
 * Credentials interface for login
 */
export interface Credentials {
  email: string;
  password: string;
}

/**
 * Registration data interface
 */
export interface RegistrationData extends Partial<User> {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
} 