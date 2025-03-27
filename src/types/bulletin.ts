/**
 * Bulletin entity interfaces for the application
 */

/**
 * Bulletin interface
 */
export interface Bulletin {
  _id: string;
  title?: string;
  content: string;
  name: string;
  email: string;
  status: string;
  messageType: string;
  replies?: BulletinReply[];
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  specialty?: string;
  state?: string;
  userId?: string;
  sessionId?: string;
  privacyPolicyAccepted: boolean;
}

/**
 * Reply to a bulletin
 */
export interface BulletinReply {
  _id: string;
  content: string;
  name: string;
  email: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  privacyPolicyAccepted: boolean;
}

/**
 * Bulletin filtering parameters
 */
export interface BulletinParams {
  status?: string;
  messageType?: string;
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  sort?: string;
  [key: string]: any;
}

/**
 * Bulletin pagination response
 */
export interface BulletinPaginationResponse {
  bulletins: Bulletin[];
  totalBulletins: number;
  page: number;
  limit: number;
  totalPages: number;
} 