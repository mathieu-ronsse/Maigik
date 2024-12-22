import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { validateEnvironment } from './config/environment.js';
import { validateReplicateConfig } from './config/replicate.js';
import replicateRoutes from './routes/replicate.routes.js';
import { errorHandler } from './middleware/error.handler.js';
import { logger } from './utils/logger.js';

try {
  // Validate environment variables before starting the server
  validateEnvironment();
  validateReplicateConfig();

  const app = express();
  const port = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/replicate', replicateRoutes);

  // Error handling
  app.use(errorHandler);

  app.listen(port, () => {
    logger.info(`API server running on port ${port}`);
  });
} catch (error) {
  logger.error('Failed to start server:', error);
  process.exit(1);
}