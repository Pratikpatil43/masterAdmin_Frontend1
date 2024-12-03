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
  }
});
