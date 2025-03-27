/**
 * Send page view event to analytics
 * @param {string} url URL of the page
 */
export function trackPageView(url: string): void {
  try {
    // Check if Google Analytics is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'G-YOUR-TRACKING-ID', {
        page_path: url
      });
      console.log('Page view tracked:', url);
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track event in analytics
 * @param {string} category Event category
 * @param {string} action Event action
 * @param {string} label Event label
 * @param {number} value Event value
 */
export function trackEvent(category: string, action: string, label?: string, value?: number): void {
  try {
    // Check if Google Analytics is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
      console.log(`Event tracked: ${category} / ${action}`, { label, value });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Initialize outbound link tracking
 */
export function initOutboundLinkTracking(): void {
  try {
    if (typeof document === 'undefined') return;

    // Find all links and add click event listeners
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href') || '';
      const isExternal = 
        href.indexOf('http') === 0 && 
        !href.includes(window.location.hostname);
      
      if (isExternal) {
        trackEvent('Outbound Link', 'Click', href);
      }
    });
    
    console.log('Outbound link tracking initialized');
  } catch (error) {
    console.error('Error initializing outbound link tracking:', error);
  }
} 