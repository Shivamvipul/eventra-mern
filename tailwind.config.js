/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF9F6',
        ink: '#18181F',
        primary: {
          50: '#F2EEFB',
          100: '#E1D8F6',
          200: '#C3B1ED',
          300: '#A48AE3',
          400: '#8763DA',
          500: '#6D3FD1', // core brand violet — "stage curtain"
          600: '#5B2FB8',
          700: '#48249A',
          800: '#361A75',
          900: '#241150',
        },
        accent: {
          400: '#FFB74D',
          500: '#F59E0B', // "spotlight amber"
          600: '#D9840A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1B1B24',
        },
        canvas: {
          light: '#FAF9F6',
          dark: '#121218',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'perforation': 'radial-gradient(circle, transparent 6px, currentColor 6.5px, currentColor 7px, transparent 7.5px)',
      },
    },
  },
  plugins: [],
};
