import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import directionRoutes from './routes/direction.routes';
import goalRoutes from './routes/goal.routes';
import userRoutes from './routes/user.route';

const app: Application = express();

// APPROACH 1: Manual CORS Headers (Most Reliable)
app.use((req: Request, res: Response, next: NextFunction): void => {
    // Set CORS headers manually
    res.header('Access-Control-Allow-Origin', 'https://maqsaddosh-website.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    next();
});

// APPROACH 2: Ultra-permissive CORS (for testing)
// Uncomment this and comment out APPROACH 1 if needed
/*
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: false
}));
*/

// APPROACH 3: Function-based origin checking
// Uncomment this and comment out APPROACH 1 if needed
/*
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, postman)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:5173',
            'https://maqsaddosh-website.vercel.app'
        ];

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
*/

app.use(express.json());

// Add debugging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

app.use('/api', directionRoutes);
app.use('/api', goalRoutes);
app.use('/api', userRoutes);

// Test endpoint to verify CORS
app.get('/test-cors', (req: Request, res: Response) => {
    res.json({
        message: 'CORS test successful',
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});

export default app;
