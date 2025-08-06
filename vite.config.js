// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://3.95.238.222',
        changeOrigin: true,
        secure: false,
        // '/api/user/register/' -> 'https://ed36.../api/user/register/'
        rewrite: (path) => path, // Keep /api as is
      },
    },
  },
});
