// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
       'ivozagent.rivoz.in','ec2-18-207-177-29.compute-1.amazonaws.com'
   ],
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
