import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  base: '/admin/',
  build: {
    outDir: path.resolve(__dirname, '../dist/admin'),
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/p': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/sitemap.xml': 'http://localhost:3000',
      '/robots.txt': 'http://localhost:3000',
      '/health': 'http://localhost:3000'
    }
  }
});
