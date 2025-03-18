/**
 * Service für die Verwaltung von Cookies und Cookie-Einstellungen
 */
class CookieService {
  /**
   * Cookie mit angegebener Lebensdauer setzen
   * @param {string} name - Name des Cookies
   * @param {string} value - Wert des Cookies
   * @param {number} days - Gültigkeitsdauer in Tagen
   */
  setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
  }

  /**
   * Cookie auslesen
   * @param {string} name - Name des Cookies
   * @returns {string} - Wert des Cookies oder leerer String, wenn nicht gefunden
   */
  getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
  }

  /**
   * Cookie löschen
   * @param {string} name - Name des Cookies
   */
  deleteCookie(name) {
    this.setCookie(name, '', -1);
  }

  /**
   * Prüfen, ob Cookies akzeptiert wurden
   * @returns {boolean} - true, wenn Cookies akzeptiert wurden, sonst false
   */
  areCookiesAccepted() {
    return this.getCookie('cookie-consent') === 'accepted';
  }

  /**
   * Akzeptieren aller Cookies
   */
  acceptCookies() {
    this.setCookie('cookie-consent', 'accepted', 365);
    window.cookiesEnabled = true;
    
    // Hier können weitere Aktionen ausgeführt werden, z.B. Analytics aktivieren
    this.triggerConsentEvent('accepted');
  }

  /**
   * Ablehnen aller nicht wesentlichen Cookies
   */
  rejectCookies() {
    this.setCookie('cookie-consent', 'rejected', 365);
    window.cookiesEnabled = false;
    
    // Hier könnten z.B. Tracking-Cookies gelöscht werden
    this.triggerConsentEvent('rejected');
  }

  /**
   * Cookie-Einwilligung zurücksetzen (z.B. für erneute Abfrage)
   */
  resetConsent() {
    this.deleteCookie('cookie-consent');
  }

  /**
   * Event auslösen, wenn sich der Cookie-Consent-Status ändert
   * @param {string} status - Consent-Status ('accepted' oder 'rejected')
   */
  triggerConsentEvent(status) {
    const event = new CustomEvent('cookie-consent-changed', { 
      detail: { status }
    });
    document.dispatchEvent(event);
  }
}

// Singleton-Instanz exportieren
export default new CookieService(); 