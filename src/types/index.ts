// Re-export all types from the types directory
export * from './user';
export * from './bulletin';

// Define common utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: number;
  success: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  pagination: Pagination;
}>;

// Common state interfaces for stores
export interface BaseState {
  loading: boolean;
  error: string | null;
}

export interface EntityState<T> extends BaseState {
  data: T | null;
  list: T[];
}

// Form validation types
export type ValidationRule = (value: any) => boolean | string;

export interface ValidationRules {
  [key: string]: ValidationRule[];
}

export interface FormErrors {
  [key: string]: string | null;
} 