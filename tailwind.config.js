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
        // Moderne Blautöne (Hauptfarbe) - Medizinisch vertrauenswürdig
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#B9E6FE',
          300: '#7CD4FD',
          400: '#36BFFA',
          500: '#0CA5E9',  // Neue Hauptfarbe - heller und moderner
          600: '#0086C9',  // Aktuell für Buttons und wichtige Elemente
          700: '#026AA2',  // Dunklerer Ton für Hover-States
          800: '#065986',
          900: '#0B4A6F',
        },
        // Komplementärfarbe - Warmes Grün (beruhigend, heilend)
        secondary: {
          50: '#EFFDF5',
          100: '#D9FBE8',
          200: '#AFF4D0',
          300: '#75E8B6',
          400: '#39D496',
          500: '#16B378',  // Neue Sekundärfarbe
          600: '#0C9269',
          700: '#0A7554',
          800: '#0A5C46',
          900: '#084C3B',
        },
        // Akzentfarbe - Warmes Violett (fortschrittlich, innovativ)
        accent: {
          50: '#FCF5FF',
          100: '#F8EBFF',
          200: '#EFD6FF',
          300: '#E2B8FF',
          400: '#C983FF',
          500: '#AD55FF',  // Neue Akzentfarbe für besondere Highlights
          600: '#9635EA',
          700: '#7C22C3',
          800: '#661DA0',
          900: '#541A7F',
        },
        // Neutraltöne
        neutral: {
          50: '#F8FAFC',   // Hintergründe
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',  // Textfarbe
          800: '#1E293B',
          900: '#0F172A',
        },
        // Funktionale Farben
        success: {
          light: '#ECFDF5',
          DEFAULT: '#10B981',
          dark: '#065F46',
        },
        warning: {
          light: '#FFFBEB',
          DEFAULT: '#F59E0B',
          dark: '#B45309',
        },
        error: {
          light: '#FEF2F2',
          DEFAULT: '#EF4444',
          dark: '#B91C1C',
        },
        info: {
          light: '#EFF6FF',
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
        },
        // Neue semantische Benennungen
        heading: '#0B4A6F',     // Dunkleres Blau für Überschriften
        'text-dark': '#334155', // Dunkler Text mit leicht bläulicher Note
        'text-light': '#F8FAFC', // Heller Text für dunkle Hintergründe
        background: {
          light: '#F8FAFC',
          card: '#FFFFFF',
          dark: '#0B4A6F',
        },
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      boxShadow: {
        'strong': '0 10px 25px -5px rgba(11, 74, 111, 0.15), 0 8px 10px -6px rgba(11, 74, 111, 0.1)',
        'card': '0 4px 6px -1px rgba(11, 74, 111, 0.1), 0 2px 4px -1px rgba(11, 74, 111, 0.06)',
        'button': '0 4px 6px -1px rgba(12, 165, 233, 0.2), 0 2px 4px -1px rgba(12, 165, 233, 0.1)',
        'hover': '0 10px 15px -3px rgba(12, 165, 233, 0.25), 0 4px 6px -2px rgba(12, 165, 233, 0.1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0CA5E9 0%, #026AA2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #16B378 0%, #0A7554 100%)',
        'gradient-accent': 'linear-gradient(135deg, #AD55FF 0%, #7C22C3 100%)',
        'gradient-banner': 'linear-gradient(90deg, #065986 0%, #0B4A6F 100%)',
        'gradient-card': 'linear-gradient(180deg, white 0%, #F8FAFC 100%)',
      },
      // Verbesserte Abgerundete Ecken
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

