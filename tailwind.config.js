/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#030712',       // slate-950 (deep space black)
          card: '#0b0f19',     // dark slate-900 (slate surface)
          accent: '#00ff66',   // neon green (stealth/matrix)
          cyan: '#00f0ff',     // neon cyan (cyberpunk)
          magenta: '#ff007f',  // neon magenta (action alerts)
          text: '#f3f4f6',     // gray-100 (primary readable text)
          muted: '#9ca3af',    // gray-400 (secondary text)
          border: 'rgba(255, 255, 255, 0.05)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'scanline': 'scanline 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(0, 255, 102, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(0, 255, 102, 0.8))' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'cyber-glow': '0 0 15px rgba(0, 255, 102, 0.25)',
        'cyan-glow': '0 0 15px rgba(0, 240, 255, 0.25)',
        'cyber-border': 'inset 0 0 8px rgba(0, 255, 102, 0.1)',
      }
    },
  },
  plugins: [],
}
