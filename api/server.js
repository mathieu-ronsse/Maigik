import express from 'express';
import cors from 'cors';
import replicateRoutes from './routes/replicate.routes.js';
import { errorHandler } from './middleware/error.handler.js';

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