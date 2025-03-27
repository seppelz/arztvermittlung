export interface CookieOptions {
  expires?: Date | number | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
  maxAge?: number;
}

/**
 * Service for handling cookies
 */
class CookieService {
  /**
   * Set cookie
   * @param {string} name Cookie name
   * @param {string} value Cookie value
   * @param {CookieOptions} options Cookie options
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): void {
    try {
      const cookieOptions = {
        path: '/',
        ...options
      };
      
      // Format expiration date
      if (cookieOptions.expires instanceof Date) {
        cookieOptions.expires = cookieOptions.expires.toUTCString();
      }
      
      // Build cookie string
      let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
      
      // Add options to cookie string
      for (const optionKey in cookieOptions) {
        if (Object.prototype.hasOwnProperty.call(cookieOptions, optionKey)) {
          const optionValue = (cookieOptions as any)[optionKey];
          updatedCookie += `; ${optionKey}`;
          
          if (optionValue !== true) {
            updatedCookie += `=${optionValue}`;
          }
        }
      }
      
      // Set cookie
      document.cookie = updatedCookie;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }
  
  /**
   * Get cookie by name
   * @param {string} name Cookie name
   * @returns {string|null} Cookie value or null if not found
   */
  getCookie(name: string): string | null {
    try {
      // Split all cookies
      const cookies = document.cookie.split(';');
      
      // Find target cookie
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        
        // Check if this is the right cookie
        if (cookie.indexOf(`${encodeURIComponent(name)}=`) === 0) {
          // Return decoded value
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
      
      // Cookie not found
      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }
  
  /**
   * Delete cookie by name
   * @param {string} name Cookie name
   * @param {CookieOptions} options Cookie options
   */
  deleteCookie(name: string, options: CookieOptions = {}): void {
    try {
      // Set cookie with expired date
      this.setCookie(name, '', {
        ...options,
        expires: new Date(0)
      });
    } catch (error) {
      console.error('Error deleting cookie:', error);
    }
  }
  
  /**
   * Check if cookies are enabled
   * @returns {boolean} True if cookies are enabled
   */
  areCookiesEnabled(): boolean {
    try {
      // Try to set a test cookie
      this.setCookie('__cookie_test__', '1');
      
      // Check if the cookie was set
      const cookieEnabled = this.getCookie('__cookie_test__') === '1';
      
      // Clean up
      this.deleteCookie('__cookie_test__');
      
      return cookieEnabled;
    } catch (error) {
      console.error('Error checking if cookies are enabled:', error);
      return false;
    }
  }

  /**
   * Accept cookies - sets a cookie indicating user acceptance
   */
  acceptCookies(): void {
    // Set cookie with 1-year expiration
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    
    this.setCookie('cookie-consent', 'accepted', {
      expires: expirationDate,
      path: '/'
    });
  }
  
  /**
   * Reject cookies - sets a cookie indicating user rejection
   */
  rejectCookies(): void {
    // Set cookie with 1-year expiration
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    
    this.setCookie('cookie-consent', 'rejected', {
      expires: expirationDate,
      path: '/'
    });
  }
}

export default new CookieService(); 