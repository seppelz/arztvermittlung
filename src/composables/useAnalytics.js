import { trackEvent, trackFormSubmission } from '../services/analyticsService'

/**
 * Composable for using analytics tracking in Vue components
 * 
 * Provides methods to track events, page views, and form submissions
 * with helpful defaults and type safety.
 */
export function useAnalytics() {
  /**
   * Track a user interaction event
   * @param {string} eventName - Name of the event to track
   * @param {Object} [props={}] - Optional properties to associate with the event
   */
  const trackInteraction = (eventName, props = {}) => {
    trackEvent(eventName, props);
  };

  /**
   * Track a form submission with the form name and optional details
   * @param {string} formName - Name of the form being submitted
   * @param {Object} [details={}] - Optional details about the submission
   */
  const trackForm = (formName, details = {}) => {
    trackFormSubmission(formName);
    // Track additional details if provided
    if (Object.keys(details).length > 0) {
      trackEvent(`Form: ${formName}`, details);
    }
  };

  /**
   * Track a feature usage
   * @param {string} featureName - Name of the feature being used
   * @param {Object} [details={}] - Optional details about the usage
   */
  const trackFeatureUsage = (featureName, details = {}) => {
    trackEvent('Feature Used', { feature: featureName, ...details });
  };

  /**
   * Track an error that occurred
   * @param {string} errorType - Type of error
   * @param {string} errorMessage - Error message
   * @param {Object} [details={}] - Optional additional details
   */
  const trackError = (errorType, errorMessage, details = {}) => {
    trackEvent('Error', { 
      type: errorType, 
      message: errorMessage,
      ...details
    });
  };

  return {
    trackInteraction,
    trackForm,
    trackFeatureUsage,
    trackError
  };
} 