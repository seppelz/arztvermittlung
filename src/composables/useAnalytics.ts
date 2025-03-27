import { trackEvent as trackAnalyticsEvent } from '../services/analyticsService'

// Define types for analytics functions
interface EventProps {
  [key: string]: any;
}

interface FormDetails {
  [key: string]: any;
}

interface FeatureDetails {
  [key: string]: any;
}

interface ErrorDetails {
  [key: string]: any;
}

/**
 * Composable for using analytics tracking in Vue components
 * 
 * Provides methods to track events, page views, and form submissions
 * with helpful defaults and type safety.
 */
export function useAnalytics() {
  /**
   * Track a user interaction event
   * @param eventName - Name of the event to track
   * @param props - Optional properties to associate with the event
   */
  const trackInteraction = (eventName: string, props: EventProps = {}): void => {
    trackAnalyticsEvent('Interaction', eventName, JSON.stringify(props));
  };

  /**
   * Track a form submission with the form name and optional details
   * @param formName - Name of the form being submitted
   * @param details - Optional details about the submission
   */
  const trackForm = (formName: string, details: FormDetails = {}): void => {
    trackAnalyticsEvent('Form', formName);
    // Track additional details if provided
    if (Object.keys(details).length > 0) {
      trackAnalyticsEvent('Form Details', `Form: ${formName}`, JSON.stringify(details));
    }
  };

  /**
   * Track a feature usage
   * @param featureName - Name of the feature being used
   * @param details - Optional details about the usage
   */
  const trackFeatureUsage = (featureName: string, details: FeatureDetails = {}): void => {
    trackAnalyticsEvent('Feature', featureName, JSON.stringify({ ...details }));
  };

  /**
   * Track an error that occurred
   * @param errorType - Type of error
   * @param errorMessage - Error message
   * @param details - Optional additional details
   */
  const trackError = (errorType: string, errorMessage: string, details: ErrorDetails = {}): void => {
    trackAnalyticsEvent('Error', errorType, JSON.stringify({ 
      message: errorMessage,
      ...details
    }));
  };

  return {
    trackInteraction,
    trackForm,
    trackFeatureUsage,
    trackError
  };
} 