/**
 * Analytics Service
 * 
 * This service provides methods for tracking user behavior using Plausible Analytics.
 * Plausible is a privacy-friendly alternative to Google Analytics that doesn't use cookies
 * and is fully compliant with GDPR, CCPA, and PECR regulations.
 */

// Tracks a custom event with optional props
export const trackEvent = (eventName, props = {}) => {
  if (window.plausible) {
    window.plausible(eventName, { props });
  } else {
    console.warn('Plausible Analytics not initialized. Event not tracked:', eventName);
  }
};

// Track page views manually (useful for SPA navigation)
export const trackPageView = (url) => {
  if (window.plausible) {
    window.plausible('pageview', { url: url || window.location.href });
  } else {
    console.warn('Plausible Analytics not initialized. Page view not tracked:', url || window.location.href);
  }
};

// Initialize outbound link tracking
export const initOutboundLinkTracking = () => {
  document.addEventListener('click', (event) => {
    // Find closest link element
    const link = event.target.closest('a');
    
    if (link && 
        link.href && 
        link.hostname !== window.location.hostname && 
        !link.classList.contains('no-track')) {
      
      trackEvent('Outbound Link', { url: link.href });
    }
  });
};

// Track form submissions
export const trackFormSubmission = (formName) => {
  trackEvent('Form Submission', { form: formName });
};

// Track clicks on specific elements
export const initClickTracking = (selector, eventName) => {
  document.querySelectorAll(selector).forEach(element => {
    element.addEventListener('click', () => {
      trackEvent(eventName, { element: element.textContent || element.id || selector });
    });
  });
};

export default {
  trackEvent,
  trackPageView,
  initOutboundLinkTracking,
  trackFormSubmission,
  initClickTracking
}; 