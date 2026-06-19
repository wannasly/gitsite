import { defineConfig } from 'vite'
import react from '@vitejs/react-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gitsite/', // ТАК СТИЛИ И СКРИПТЫ НЕ ПОТЕРЯЮТСЯ НА GITHUB PAGES
})