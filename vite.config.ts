import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Morgan LMS',
        short_name: 'LMS',
        start_url: '/morgan-lms/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#06b6d4',
        icons: [],
      },
    }),
  ],
  base: process.env.GITHUB_ACTIONS ? '/morgan-lms/' : '/',
});