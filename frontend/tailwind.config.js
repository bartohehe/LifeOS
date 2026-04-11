/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: {
          900: '#0c0c14',
          800: '#111120',
          700: '#161628',
        },
        glass: {
          border: 'rgba(253, 250, 245, 0.12)',
          surface: 'rgba(253, 250, 245, 0.06)',
          highlight: 'rgba(253, 250, 245, 0.18)',
        },
        accent: {
          violet: '#7c3aed',
          'violet-light': '#a78bfa',
          'violet-dark': '#5b21b6',
        },
        offwhite: {
          DEFAULT: '#fdfaf5',
          muted: 'rgba(253, 250, 245, 0.6)',
          subtle: 'rgba(253, 250, 245, 0.35)',
        },
        xp: {
          start: '#7c3aed',
          end: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(253, 250, 245, 0.15)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(253, 250, 245, 0.2)',
        violet: '0 0 20px rgba(124, 58, 237, 0.4)',
      },
    },
  },
  plugins: [],
}
