import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#dbeeff',
          200: '#bcdfff',
          300: '#8fc9ff',
          400: '#58aafc',
          500: '#2d8de5',
          600: '#1d6fc2',
          700: '#1758a0',
          800: '#164a82',
          900: '#173f69'
        }
      },
      fontFamily: {
        vazir: ['\"Vazirmatn\"', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config;
