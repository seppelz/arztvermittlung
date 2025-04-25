# Analytics Implementation

This document provides guidelines for implementing and using Umami Analytics in the MedMatch application.

## Why Umami Analytics?

We've chosen Umami Analytics for several important reasons:

1. **Privacy-Focused**: Umami doesn't use cookies, doesn't collect personal data, and is fully GDPR, CCPA, and PECR compliant.
2. **No Cookie Banners Needed**: Since Umami doesn't use cookies, we don't need to show annoying cookie consent banners.
3. **Lightweight**: Umami's script is under 2KB, resulting in faster page loads.
4. **Open Source**: Umami is completely open-source and can be self-hosted.
5. **Free Options**: Umami offers a free cloud tier or can be self-hosted at no cost.

## Implementation

### Basic Tracking Setup

The Umami script is added to our `index.html` file:

```html
<script async defer src="https://your-umami-instance.com/script.js" data-website-id="your-website-id"></script>
```

When developing locally, you may want to disable analytics by commenting out this script.

### Setting Up a Umami Account

1. Sign up at [cloud.umami.is](https://cloud.umami.is/signup) for the cloud version
   - OR follow the [self-hosting guide](https://umami.is/docs/install)
2. Create a new website in your dashboard
3. Update the script tag in `index.html` with your website's specific details

### Custom Event Tracking

For custom event tracking, use the following method:

```typescript
// Track a page view manually
umami.trackView('/your-page-path');

// Track an event
umami.trackEvent('Button Clicked', 'signup-form');
```

## Privacy Considerations

In your privacy policy, make sure to:

1. Mention that you use Umami Analytics
2. Explain that it's cookie-free and privacy-focused
3. Link to Umami's privacy documentation: https://umami.is/docs/privacy

## Troubleshooting

If analytics isn't working:

1. Check your browser's network tab to confirm the script is loading
2. Verify your website ID is correct
3. Check that the domain matches in the Umami dashboard

## Dashboard Access

Access your Umami dashboard at: `https://cloud.umami.is` (or your self-hosted URL) 