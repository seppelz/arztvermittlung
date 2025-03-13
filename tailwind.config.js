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
        secondary: '#60A3D9',
        accent: '#BFD7ED',
        dark: '#003B73',
        light: '#F8FAFC',
      },
    },
  },
  plugins: [],
}

