/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        kdark: '#0a0a0f',
        kcard: '#141420',
        kborder: '#1e1e2e',
        kred: '#e50914',
        kredHover: '#c40812',
        kgold: '#f5c518',
        kgray: '#8a8a9a',
        klight: '#e8e8f0',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"Poppins"', 'sans-serif'],
        korean: ['"Noto Sans KR"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-red': 'pulseRed 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        slideInRight: { '0%': { transform: 'translateX(20px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
        pulseRed: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(229,9,20,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(229,9,20,0)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
      }
    }
  },
  plugins: [],
};
