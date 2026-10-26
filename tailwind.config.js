/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0a0a0d',
          900: '#0F0F12', // Base background
          850: '#15151c',
          800: '#1A1A22', // Card surface
          700: '#23232d',
          600: '#2f2f3d',
          500: '#464658',
        },
        hotpink: {
          300: '#ff77c0',
          400: '#ff3d9f',
          500: '#FF1493', // Vibrant Hot Pink accent
          600: '#db0077',
          700: '#b0005f',
          900: '#52002c',
        },
        warmgold: {
          400: '#ffd066',
          500: '#FFB800',
          600: '#d99800',
        }
      },
      boxShadow: {
        'pink-glow': '0 0 25px -5px rgba(255, 20, 147, 0.45)',
        'pink-glow-sm': '0 0 15px -3px rgba(255, 20, 147, 0.3)',
        'pink-glow-lg': '0 0 40px -5px rgba(255, 20, 147, 0.55)',
        'gold-glow': '0 0 25px -5px rgba(255, 184, 0, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatRev 10s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) scale(1.05)' },
          '50%': { transform: 'translateY(20px) scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
