/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#04070f',
          900: '#080d1a',
          800: '#0e1628',
          700: '#141f36',
          600: '#1a2744',
          500: '#1e2f52',
        },
        brand: {
          50:  '#f5f0ff',
          100: '#ede0ff',
          200: '#d9c0ff',
          300: '#be93ff',
          400: '#a35aff',
          500: '#8b2fff',
          600: '#7c11f5',
          700: '#6a0dd0',
          800: '#5809a8',
          900: '#490888',
        },
        accent: {
          cyan:   '#06b6d4',
          emerald:'#10b981',
          amber:  '#f59e0b',
          rose:   '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow:     '0 0 20px rgba(124, 17, 245, 0.25)',
        'glow-sm':'0 0 10px rgba(124, 17, 245, 0.15)',
        card:     '0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-in-r': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn:       { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp:      { from:{ opacity:0, transform:'translateY(20px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        slideInRight: { from:{ opacity:0, transform:'translateX(20px)' }, to:{ opacity:1, transform:'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
