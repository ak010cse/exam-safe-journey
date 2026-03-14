import { Router } from 'express';
import { register, login, refreshToken, getCurrentUser, logout } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const authRouter = Router();

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
authRouter.post('/register', register);

/**
 * POST /api/v1/auth/login
 * Login user
 */
authRouter.post('/login', login);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
authRouter.post('/refresh', refreshToken);

/**
 * GET /api/v1/auth/me
 * Get current user (protected)
 */
authRouter.get('/me', authMiddleware, getCurrentUser);

/**
 * POST /api/v1/auth/logout
 * Logout user
 */
authRouter.post('/logout', authMiddleware, logout);

export default authRouter;
