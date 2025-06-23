import express, { Application } from 'express';
import cors from 'cors';
import directionRoutes from './routes/direction.routes';
import goalRoutes from './routes/goal.routes';
import userRoutes from './routes/user.route';

const app: Application = express();

// Configure CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://maqsaddosh-website.vercel.app'
    ],
    credentials: true,
}));

app.use(express.json());
app.use('/api', directionRoutes);
app.use('/api', goalRoutes);
app.use('/api', userRoutes);

export default app;
