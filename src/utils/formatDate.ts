// src/utils/formatDate.ts

/**
 * Formats a date string into a German locale string (e.g., "17. April 2024").
 * @param dateString The date string to format (ISO format preferred).
 * @returns The formatted date string or an empty string if input is invalid.
 */
export const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) {
    return '';
  }
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('[formatDate] Invalid date string provided:', dateString);
      return ''; 
    }
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) { 
    console.error('[formatDate] Error formatting date:', dateString, error);
    return ''; // Return empty string on error
  }
};
