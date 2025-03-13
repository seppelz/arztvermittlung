/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        primary: '#0074B7',
        'primary-dark': '#005A8F',
        secondary: '#60A3D9',
        accent: '#BFD7ED',
        dark: '#003B73',
        'dark-800': '#002A54',
        light: '#F8FAFC',
        'heading': '#003B73',
        'text-dark': '#1F2937',
        'highlight': '#0090E1',
        'success': '#059669',
        'warning': '#F59E0B',
        'error': '#DC2626',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      boxShadow: {
        'strong': '0 10px 25px -5px rgba(0, 59, 115, 0.1), 0 8px 10px -6px rgba(0, 59, 115, 0.1)',
      },
    },
  },
  plugins: [],
}

