import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

/**
 * Health check endpoint
 */
export async function healthCheck(req: AuthRequest, res: Response): Promise<void> {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
