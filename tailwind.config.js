/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        frost: {
          base: '#59697a',
          deep: '#46545f',
          mist: '#8598a6',
          card: '#aebdc8',
          snow: '#dde2e4',
          ink: '#12191f',
          white: '#f2f5f6',
          line: 'rgba(242, 245, 246, 0.18)',
        },
      },
      fontFamily: {
        display: ['Oswald', 'Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        tag: ['Permanent Marker', 'cursive'],
      },
    },
  },
  plugins: [],
}
