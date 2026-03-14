import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/auth';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userEmail?: string;
}

/**
 * Middleware to verify JWT token
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    res.status(401).json({ error: 'No authorization token provided' });
    return;
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.userId = payload.userId;
  req.userRole = payload.role;
  req.userEmail = payload.email;

  next();
}

/**
 * Middleware to check admin role
 */
export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.userRole !== 'ADMIN') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
}

/**
 * Middleware to check moderator role
 */
export function moderatorMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.userRole !== 'ADMIN' && req.userRole !== 'MODERATOR') {
    res.status(403).json({ error: 'Moderator access required' });
    return;
  }

  next();
}
