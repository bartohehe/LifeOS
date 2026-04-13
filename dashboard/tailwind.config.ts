import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark:            '#1E2D1A',
        mid:             '#3D5C35',
        accent:          '#5C7A4E',
        bg:              '#EFF5EC',
        surface:         '#DAE8D4',
        line:            '#B8CDB2',
        beige:           '#E8D5B7',
        'beige-dark':    '#C8A87A',
        'beige-surface': '#F5EAD8',
        'beige-line':    '#D4BC9E',
      },
      borderRadius: { card: '16px' },
      boxShadow: { card: '0 4px 24px rgba(30,45,26,0.10)' },
    },
  },
  plugins: [],
}
export default config
