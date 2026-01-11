
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Diese Konfiguration sorgt dafür, dass die App auf Plattformen wie Vercel 
// reibungslos läuft und den API-Key findet.
export default defineConfig({
  plugins: [react()],
  define: {
    // Macht den API_KEY im Browser verfügbar
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
  }
});
