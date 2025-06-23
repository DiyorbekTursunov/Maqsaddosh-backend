import { Router } from 'express';
import { signup, login, googleAuth, telegramAuth, getCurrentUser, updateAccount } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/telegram', telegramAuth);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.patch('/me', authenticate, updateAccount);

export default router;
