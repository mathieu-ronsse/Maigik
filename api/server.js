import express from 'express';
import cors from 'cors';
import { validateEnvironment } from './config/environment.js';
import replicateRoutes from './routes/replicate.routes.js';
import { errorHandler } from './middleware/error.handler.js';

// Validate environment variables before starting the server
validateEnvironment();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/replicate', replicateRoutes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});