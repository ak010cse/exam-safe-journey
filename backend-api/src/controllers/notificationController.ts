import { Request, Response } from 'express';
import { prisma } from '../database/prisma';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      userEmail?: string;
    }
  }
}

/**
 * Get user notifications
 * GET /api/v1/notifications
 */
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const { read } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const where: any = { userId };

    // Filter by read status if specified
    if (read === 'true') {
      where.isRead = true;
    } else if (read === 'false') {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          relatedId: true,
          isRead: true,
          createdAt: true,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({
      message: 'Notifications retrieved successfully',
      data: notifications,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

/**
 * Get unread notification count
 * GET /api/v1/notifications/count/unread
 */
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    res.json({
      message: 'Unread count retrieved',
      data: { unreadCount: count },
    });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

/**
 * Mark notification as read
 * PUT /api/v1/notifications/:id/read
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: 'Notification marked as read',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

/**
 * Mark all notifications as read
 * PUT /api/v1/notifications/read-all
 */
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

/**
 * Delete notification
 * DELETE /api/v1/notifications/:id
 */
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { id },
    });

    res.json({
      message: 'Notification deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

/**
 * Delete all notifications
 * DELETE /api/v1/notifications
 */
export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.notification.deleteMany({
      where: { userId },
    });

    res.json({
      message: 'All notifications deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ error: 'Failed to delete all notifications' });
  }
};

/**
 * Subscribe to notifications (for future WebSocket/Server-Sent Events)
 * POST /api/v1/notifications/subscribe
 */
export const subscribeToNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { notificationTypes } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Update user notification preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = user.preferences ? JSON.parse(user.preferences) : {};
    preferences.notificationSubscriptions = notificationTypes || [
      'EXAM_UPDATE',
      'TRAVEL_ALERT',
      'STAY_REVIEW',
      'COMMUNITY_REPLY',
      'PARTNER_MATCH',
    ];

    await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: JSON.stringify(preferences),
      },
    });

    res.json({
      message: 'Notification subscription updated',
      data: preferences.notificationSubscriptions,
    });
  } catch (error: any) {
    console.error('Error updating notification subscription:', error);
    res.status(500).json({ error: 'Failed to update notification subscription' });
  }
};

/**
 * Create notification (admin/system only - internal use)
 * POST /api/v1/notifications/send
 */
export const createNotification = async (req: Request, res: Response) => {
  try {
    // This endpoint is for internal use, typically called by background jobs or admin
    // It should not be exposed to regular users
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create notifications' });
    }

    const { userId, type, title, message, relatedId } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: 'Required fields: userId, type, title, message' });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId: relatedId || null,
      },
    });

    res.status(201).json({
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};
