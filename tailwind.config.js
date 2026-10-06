/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Space Grotesk', 'sans-serif'] },
      colors: {
        elison: {
          black: '#0a0a0a', dark: '#111111', charcoal: '#1a1a1a', gray: '#888888', light: '#e5e5e5', white: '#fafafa',
          accent: '#ff6b35', music: '#6366f1', tech: '#06b6d4', legal: '#10b981', brand: '#f59e0b', shorthouse: '#fd7104',
        },
      },
      animation: { float: 'float 6s ease-in-out infinite', 'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
      keyframes: { float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } } },
    },
  },
};
