# New Knowledge Base

This document contains insights and learnings gained during the development of the MedMatch platform.

## Project Structure
- Vue.js 3 with Composition API provides a clean and maintainable structure for component development
- Tailwind CSS enables rapid UI development with utility classes
- Vue Router handles navigation with lazy-loaded components for better performance

## Design Patterns
- Using reactive forms with validation for user input
- Implementing responsive design with mobile-first approach
- Component composition for reusable UI elements
- Conditional rendering for form submission feedback

## German Market Specifics
- Medical specialties terminology in German context
- German hospital classification system (Universitätsklinikum, Krankenhaus der Maximalversorgung, etc.)
- German regions (Bundesländer) for geographic targeting
- GDPR compliance considerations for medical data
- German legal requirements for websites ("Impressum" page is mandatory)
- Detailed privacy policies required under German law and GDPR

## Team Page Structure
- Leadership team presentation with detailed backgrounds contextualizes expertise 
- Displaying team member credentials builds trust, especially important in medical field
- Career section on team page helps with recruitment and company growth
- Using placeholder SVGs with consistent styling maintains professionalism even without actual photos 

## CSS and Styling
- Tailwind CSS 3.3 is more stable than the newer version 4.0 for Vue.js projects
- ES Module syntax (export default) must be used in config files when package.json has "type": "module"
- SVG icons may need explicit styling constraints to ensure proper sizing
- For Tailwind CSS, always keep the configuration simple with separate tailwind.config.js file
- In Vue.js projects, proper order of tailwind directives (@tailwind base, components, utilities) is crucial
- For better compatibility and debugging, use standard Tailwind installation procedures
- When upgrading Tailwind, consider the impact on existing styles and custom theme configuration
- Tailwind's container class by default has max-width constraints; customize it in tailwind.config.js for full-width layouts
- Always add explicit width utilities (w-full) to parent containers to ensure proper width inheritance
- Use flex-grow with w-full for expandable containers that take available space
- Set explicit responsive image sizes with classes like max-w-full and h-auto to prevent distortion
- CSS @import statements must come before Tailwind directives to avoid PostCSS warnings

## Deployment and Version Control
- Vercel simplifies deployment of Vue.js applications with zero configuration
- Creating a vercel.json file provides additional control over deployment settings
- SPA routing requires configuration to handle client-side routes on deployment platforms
- Proper .gitignore settings are crucial to avoid committing node_modules, dist directories, and environment files
- Documentation (README.md, CHANGELOG.md) should be regularly updated before deployment for transparency
- For Vue.js projects on Vercel, setting the framework to "vite" optimizes the build process 