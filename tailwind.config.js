/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './context/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        obsidian: {
          950: '#050507',
          900: '#0a0a0f',
          800: '#111118',
          700: '#1a1a24',
          600: '#24243a',
          500: '#2e2e4a',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        jade: '#1D6FEB',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 212, 170, 0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(0, 212, 170, 0.15)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.35s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        pulse_glow: 'pulse_glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
