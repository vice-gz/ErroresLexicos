/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vice: {
          bg: '#111019',
          bgSec: '#191521',
          panel: '#211B2B',
          panelSec: '#292136',
          purple: '#8053C8',
          purpleBright: '#A875F5',
          violetSoft: '#C4A1FF',
          border: '#40334F',
          text: '#F3ECFA',
          textSec: '#A99DB5',
          success: '#22C55E',
          error: '#EF4444',
          warning: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      keyframes: {
        floatParticle: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: '0.35' },
          '50%': { transform: 'translateY(-10px) scale(1.15)', opacity: '0.85' },
        },
        eyePulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px #A875F5)' },
          '50%': { filter: 'drop-shadow(0 0 10px #C4A1FF)' },
        }
      },
      animation: {
        'particle-slow': 'floatParticle 4s ease-in-out infinite',
        'particle-fast': 'floatParticle 2.6s ease-in-out infinite',
        'eye-glow': 'eyePulse 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
