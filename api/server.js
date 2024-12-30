import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { validateEnvironment } from './config/environment.js';
import { validateReplicateConfig } from './config/replicate.js';
import replicateRoutes from './routes/replicate.routes.js';
import predictionsRoutes from './routes/predictions.routes.js';
import { errorHandler } from './middleware/error.handler.js';
import { logger } from './utils/logger.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/replicate', replicateRoutes);
app.use('/api/predictions', predictionsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`API server running on port ${port}`);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});