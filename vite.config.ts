import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { Handler } from '@netlify/functions';

// Load and instantiate Netlify Functions
const netlifyFunctions: Record<string, Handler> = {
  replicate: require('./netlify/functions/replicate').handler,
  predictions: require('./netlify/functions/predictions').handler
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/replicate': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (req.method === 'POST') {
              const handler = netlifyFunctions.replicate;
              handler(req as any, {} as any, () => {})
                .then(response => {
                  res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                  res.end(response.body);
                })
                .catch(error => {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: error.message }));
                });
            }
          });
        }
      },
      '/api/predictions': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const handler = netlifyFunctions.predictions;
            handler(req as any, {} as any, () => {})
              .then(response => {
                res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                res.end(response.body);
              })
              .catch(error => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
              });
          });
        }
      }
    }
  }
});