import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { validateEnv } from './lib/config/env';
import App from './App';
import './index.css';

// Validate environment variables before app starts
validateEnv();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);