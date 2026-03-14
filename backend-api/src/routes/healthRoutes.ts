import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

const healthRouter = Router();

/**
 * GET /api/v1/health
 * Health check endpoint
 */
healthRouter.get('/', healthCheck);

export default healthRouter;
