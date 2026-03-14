import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  subscribeToNotifications,
  createNotification,
} from '../controllers/notificationController';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

// Public user endpoints
router.get('/', getNotifications);
router.get('/count/unread', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);
router.post('/subscribe', subscribeToNotifications);

// Admin-only endpoint
router.post('/send', createNotification);

export default router;
