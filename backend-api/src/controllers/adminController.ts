import { Request, Response } from 'express';
import prisma from '../config/database';
import { handleError } from '../utils/errorHandler';
import Joi from 'joi';
import bcrypt from 'bcryptjs';

// Validation schemas
const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('USER', 'MODERATOR', 'ADMIN').required(),
  userId: Joi.string().required(),
});

const banUserSchema = Joi.object({
  userId: Joi.string().required(),
  reason: Joi.string().max(500).required(),
});

const updateUserStatusSchema = Joi.object({
  userId: Joi.string().required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'BANNED').required(),
});

// ===== USER MANAGEMENT =====

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Admin only
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const { page = 1, limit = 20, search = '', status = '', role = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const skip = (pageNum - 1) * limitNum;

    let whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (status) whereClause.status = status;
    if (role) whereClause.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          createdAt: true,
          examType: true,
          targetCity: true,
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    res.json({
      message: 'Users retrieved successfully',
      data: users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: { select: { id: true, title: true, createdAt: true } },
        comments: { select: { id: true, createdAt: true } },
        reviews: { select: { id: true, createdAt: true } },
        notifications: { select: { id: true, type: true, createdAt: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User details retrieved',
      data: user,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const { error, value } = updateUserRoleSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await prisma.user.findUnique({ where: { id: value.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await prisma.user.update({
      where: { id: value.userId },
      data: { role: value.role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });

    res.json({
      message: `User role updated to ${value.role}`,
      data: updated,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const { error, value } = banUserSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await prisma.user.findUnique({ where: { id: value.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(400).json({ message: 'Cannot ban admin users' });
    }

    const banned = await prisma.user.update({
      where: { id: value.userId },
      data: { status: 'BANNED' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
      },
    });

    // Create audit log
    await prisma.notification.create({
      data: {
        userId: value.userId,
        type: 'SYSTEM',
        title: 'Account Banned',
        message: `Your account has been banned. Reason: ${value.reason}`,
      },
    });

    res.json({
      message: 'User banned successfully',
      data: banned,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const unbanUser = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const unbanned = await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
      },
    });

    res.json({
      message: 'User unbanned successfully',
      data: unbanned,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// ===== CONTENT MODERATION =====

export const getFlaggedContent = async (req: Request, res: Response) => {
  try {
    if (!['ADMIN', 'MODERATOR'].includes(req.user?.role || '')) {
      return res.status(403).json({ message: 'Forbidden: Moderator access required' });
    }

    const { page = 1, limit = 20, status = 'PENDING', contentType = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const skip = (pageNum - 1) * limitNum;

    let whereClause: any = { status: status || 'PENDING' };
    if (contentType) whereClause.contentType = contentType;

    const [flaggedItems, total] = await Promise.all([
      prisma.contentFlag.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          flaggedBy: { select: { id: true, email: true } },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contentFlag.count({ where: whereClause }),
    ]);

    res.json({
      message: 'Flagged content retrieved',
      data: flaggedItems,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const moderateContent = async (req: Request, res: Response) => {
  try {
    if (!['ADMIN', 'MODERATOR'].includes(req.user?.role || '')) {
      return res.status(403).json({ message: 'Forbidden: Moderator access required' });
    }

    const { flagId } = req.params;
    const { action, reason } = req.body; // action: 'APPROVE' | 'REJECT' | 'DELETE'

    if (!['APPROVE', 'REJECT', 'DELETE'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be APPROVE, REJECT, or DELETE' });
    }

    const flag = await prisma.contentFlag.findUnique({ where: { id: flagId } });
    if (!flag) {
      return res.status(404).json({ message: 'Flagged content not found' });
    }

    // Update flag status
    const updated = await prisma.contentFlag.update({
      where: { id: flagId },
      data: {
        status: action === 'DELETE' ? 'RESOLVED' : action,
        moderatedBy: req.user?.id,
        moderationNotes: reason,
      },
    });

    // Delete content if action is DELETE
    if (action === 'DELETE') {
      if (flag.contentType === 'POST') {
        await prisma.communityPost.delete({ where: { id: flag.contentId } });
      } else if (flag.contentType === 'COMMENT') {
        await prisma.comment.delete({ where: { id: flag.contentId } });
      }
    }

    res.json({
      message: `Content ${action.toLowerCase()}ed successfully`,
      data: updated,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getPostsForModeration = async (req: Request, res: Response) => {
  try {
    if (!['ADMIN', 'MODERATOR'].includes(req.user?.role || '')) {
      return res.status(403).json({ message: 'Forbidden: Moderator access required' });
    }

    const { page = 1, limit = 20, searchQuery = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where: searchQuery
          ? {
              OR: [
                { title: { contains: searchQuery as string, mode: 'insensitive' } },
                { content: { contains: searchQuery as string, mode: 'insensitive' } },
              ],
            }
          : {},
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          _count: { select: { comments: true, likes: true } },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communityPost.count(),
    ]);

    res.json({
      message: 'Posts retrieved for moderation',
      data: posts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

// ===== ANALYTICS =====

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const [totalUsers, activeUsers, totalPosts, totalComments, totalPartners, totalQuestions] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.communityPost.count(),
        prisma.comment.count(),
        prisma.journeyPartner.count(),
        prisma.communityPost.count({ where: { tags: { has: 'qa' } } }),
      ]);

    const stats = {
      totalUsers,
      activeUsers,
      bannedUsers: await prisma.user.count({ where: { status: 'BANNED' } }),
      totalPosts,
      totalComments,
      totalPartners,
      totalQuestions,
      engagementRate: ((activeUsers / totalUsers) * 100).toFixed(2),
    };

    res.json({
      message: 'Dashboard statistics retrieved',
      data: stats,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getUserGrowth = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const { days = 30 } = req.query;
    const daysNum = Math.min(365, Math.max(7, parseInt(days as string) || 30));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    const growth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate } },
      _count: true,
    });

    // Format growth data by date
    const formattedGrowth = growth.map((item: any) => ({
      date: new Date(item.createdAt).toISOString().split('T')[0],
      count: item._count,
    }));

    res.json({
      message: 'User growth data retrieved',
      data: formattedGrowth,
      period: `Last ${daysNum} days`,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getEngagementMetrics = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const [averagePostsPerUser, averageCommentsPerUser, topContributors] = await Promise.all([
      prisma.communityPost.count().then(async (total) => {
        const userCount = await prisma.user.count();
        return (total / userCount).toFixed(2);
      }),
      prisma.comment.count().then(async (total) => {
        const userCount = await prisma.user.count();
        return (total / userCount).toFixed(2);
      }),
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          _count: { select: { posts: true, comments: true } },
        },
        orderBy: [{ posts: { _count: 'desc' } }],
        take: 10,
      }),
    ]);

    res.json({
      message: 'Engagement metrics retrieved',
      data: {
        averagePostsPerUser,
        averageCommentsPerUser,
        topContributors: topContributors.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          posts: user._count.posts,
          comments: user._count.comments,
        })),
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getActivityLog = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const { page = 1, limit = 50, userId = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
    const skip = (pageNum - 1) * limitNum;

    let whereClause: any = {};
    if (userId) whereClause.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: whereClause }),
    ]);

    res.json({
      message: 'Activity log retrieved',
      data: logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

// ===== SYSTEM MANAGEMENT =====

export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const health = {
      databaseConnection: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      environment: process.env.NODE_ENV,
    };

    res.json({
      message: 'System health retrieved',
      data: health,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getModeratorStats = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const moderators = await prisma.user.findMany({
      where: { role: 'MODERATOR' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    res.json({
      message: 'Moderator statistics retrieved',
      data: {
        totalModerators: moderators.length,
        moderators,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const createModerator = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: 'MODERATOR' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    res.json({
      message: 'User promoted to moderator',
      data: updated,
    });
  } catch (error) {
    handleError(error, res);
  }
};
