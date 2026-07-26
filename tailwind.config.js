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
          base: '#6f8291',
          deep: '#566876',
          mist: '#8598a6',
          card: '#aebdc8',
          snow: '#dde2e4',
          ink: '#12191f',
          white: '#f2f5f6',
          line: 'rgba(242, 245, 246, 0.18)',
        },
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        tag: ['Permanent Marker', 'cursive'],
      },
    },
  },
  plugins: [],
}
