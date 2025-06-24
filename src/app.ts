import express, { Application } from 'express';
import cors from 'cors';
import directionRoutes from './routes/direction.routes';
import goalRoutes from './routes/goal.routes';
import userRoutes from './routes/user.route';

const app: Application = express();

// Enhanced CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://maqsaddosh-website.vercel.app',
        'https://maqsaddosh-website.vercel.app/',  // with trailing slash
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());

// Add error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.use('/api', directionRoutes);
app.use('/api', goalRoutes);
app.use('/api', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
