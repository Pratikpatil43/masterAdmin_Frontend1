import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['jwt-decode']
    }
  },
  optimizeDeps: {
    include: ['buffer']
  },
  define: {
    global: 'window',
    Buffer: ['buffer', 'Buffer']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://attendancetracker-backend1.onrender.com', // Proxy API requests to your backend
        changeOrigin: true, // Adjust origin header for requests
        secure: false, // Accept self-signed certificates during development
      },
    },
  },
});
