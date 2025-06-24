import express, { Application, Request, Response, NextFunction } from 'express';
import directionRoutes from './routes/direction.routes';
import goalRoutes from './routes/goal.routes';
import userRoutes from './routes/user.route';
import cors from 'cors';

const app: Application = express();

// SIMPLEST CORS FIX - Put this BEFORE everything else
app.use(
  cors({
    origin: [
      "https://maqsaddosh-backend-o2af.onrender.com",
      "http://localhost:3000",
    ], // Allow Swagger UI and local dev
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use('/api', directionRoutes);
app.use('/api', goalRoutes);
app.use('/api', userRoutes);

export default app;
