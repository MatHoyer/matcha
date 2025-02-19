import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  preview: {
    port: 3001,
    strictPort: true,
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true,
    origin: 'http://0.0.0.0:3001',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
