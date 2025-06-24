import express, { Application, Request, Response, NextFunction } from 'express';
import directionRoutes from './routes/direction.routes';
import goalRoutes from './routes/goal.routes';
import userRoutes from './routes/user.route';

const app: Application = express();

// SIMPLEST CORS FIX - Put this BEFORE everything else
app.use((req: Request, res: Response, next: NextFunction) => {
    // Set CORS headers for every response
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    next();
});

app.use(express.json());
app.use('/api', directionRoutes);
app.use('/api', goalRoutes);
app.use('/api', userRoutes);

export default app;
