# Analytics Implementation Guide

This document provides guidelines for implementing and using Plausible Analytics in the MedMatch application.

## Why Plausible Analytics?

We've chosen Plausible Analytics over Google Analytics for several important reasons:

1. **Privacy-Focused**: Plausible doesn't use cookies, doesn't collect personal data, and is fully GDPR, CCPA, and PECR compliant.
2. **No Cookie Banners Needed**: Since Plausible doesn't use cookies, we don't need to show annoying cookie consent banners.
3. **Lightweight**: Plausible's script is under 1KB (compared to ~45KB for Google Analytics), resulting in faster page loads.
4. **Simple Dashboard**: Clean, easy-to-understand metrics without overwhelming complexity.
5. **Data Ownership**: Full data ownership with EU-based data storage and optional self-hosting.

## Getting Started

### Installation and Configuration

The Plausible script is already added to our `index.html` file:

```html
<script defer data-domain="med-match.de" src="https://plausible.io/js/script.js"></script>
```

When developing locally, analytics events will be logged to the console but not sent to Plausible. In production, events will be sent to our Plausible dashboard.

### Setting Up a Plausible Account

1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain (med-match.de)
3. Get your tracking script (already added)
4. Set appropriate team member access

## Using Analytics in MedMatch

### Automatic Page Tracking

Page views are automatically tracked whenever the user navigates to a new route. This is handled by the router integration in `main.js`.

### Analytics Service

For direct access, import from the analytics service:

```javascript
import { trackEvent, trackPageView, trackFormSubmission } from '@/services/analyticsService'

// Track a custom event
trackEvent('Button Clicked', { buttonName: 'Submit' })

// Manually track a page view
trackPageView('/custom-page')

// Track a form submission
trackFormSubmission('Registration Form')
```

### Vue Composable

The recommended way to use analytics in Vue components is through the `useAnalytics` composable:

```javascript
import { useAnalytics } from '@/composables/useAnalytics'

// In your setup function
const { trackInteraction, trackForm, trackFeatureUsage, trackError } = useAnalytics()

// Track user interactions
trackInteraction('Button Clicked', { buttonName: 'Submit' })

// Track form submissions
trackForm('Registration Form', { hasEmail: true })

// Track feature usage
trackFeatureUsage('Export Data', { format: 'CSV' })

// Track errors
trackError('API Error', 'Failed to fetch data', { statusCode: 500 })
```

## Best Practices

### DO

- ✅ Use semantic event names (e.g., 'Form Submission' not 'clicked submit button')
- ✅ Group related events with consistent naming (e.g., 'Form: Contact', 'Form: Registration')
- ✅ Use the provided composables and services rather than direct calls to window.plausible
- ✅ Track business-meaningful events rather than every small interaction
- ✅ Consider user privacy in all tracking decisions
- ✅ Document new event types in this documentation

### DON'T

- ❌ Track personally identifiable information (PII) such as names, emails, or IDs
- ❌ Create event explosions (too many unique event names)
- ❌ Track every minor interaction (mouse movements, hovers, etc.)
- ❌ Implement redundant tracking (already covered by automatic tracking)

## Example Implementation

Here's an example of analytics integration in a form component:

```vue
<script setup>
import { ref } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'

const { trackForm, trackInteraction } = useAnalytics()

// Track when user submits form
const submitForm = () => {
  // Track the submission
  trackForm('Contact Form', {
    // DON'T include personal data
    hasName: !!formData.name,
    hasEmail: !!formData.email,
    messageLength: formData.message.length
  })
  
  // Form submission logic...
}

// Track when user interacts with specific element
const trackSpecialInteraction = () => {
  trackInteraction('Special Feature Used', {
    location: 'Contact Form',
    action: 'clicked'
  })
}
</script>
```

## Dashboard and Reporting

Access your Plausible dashboard at: `https://plausible.io/med-match.de`

The dashboard provides:
- Visitor data
- Page views
- Referral sources
- Top pages
- Country data
- Device information
- Custom event tracking

## Privacy Policy Considerations

Update your privacy policy to inform users about analytics tracking:

1. Mention that you use Plausible Analytics
2. Explain that it's cookie-free and privacy-respecting
3. Link to Plausible's data policy: https://plausible.io/data-policy
4. Include information about what information is collected (no personal data)

## Support and Troubleshooting

If analytics events aren't being tracked:

1. Check browser console for errors
2. Verify script is loading correctly
3. Check that the domain matches in the Plausible dashboard
4. Test with event debugging enabled: `https://plausible.io/js/script.manual.js` 