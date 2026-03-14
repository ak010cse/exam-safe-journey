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
 * Get comments for a post
 * GET /api/v1/community/posts/:postId/comments
 */
export const getPostComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const { sortBy } = req.query;

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const orderBy: any = {};
    if (sortBy === 'oldest') {
      orderBy.createdAt = 'asc';
    } else {
      orderBy.createdAt = 'desc'; // default: newest first
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { communityPostId: postId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy,
      }),
      prisma.comment.count({ where: { communityPostId: postId } }),
    ]);

    res.json({
      message: 'Comments retrieved successfully',
      data: comments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

/**
 * Create comment on a post
 * POST /api/v1/community/posts/:postId/comments
 */
export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    if (content.length < 1 || content.length > 1000) {
      return res.status(400).json({ error: 'Comment must be between 1 and 1000 characters' });
    }

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        communityPostId: postId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Comment created successfully',
      data: comment,
    });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

/**
 * Update comment
 * PUT /api/v1/community/comments/:commentId
 */
export const updateComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { commentId } = req.params;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    if (content.length < 1 || content.length > 1000) {
      return res.status(400).json({ error: 'Comment must be between 1 and 1000 characters' });
    }

    // Check if comment exists and belongs to user
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (existingComment.userId !== userId && req.userRole !== 'MODERATOR') {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({
      message: 'Comment updated successfully',
      data: comment,
    });
  } catch (error: any) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

/**
 * Delete comment
 * DELETE /api/v1/community/comments/:commentId
 */
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { commentId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== userId && req.userRole !== 'MODERATOR') {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.json({
      message: 'Comment deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

/**
 * Get comments by user
 * GET /api/v1/community/users/:userId/comments
 */
export const getUserComments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          communityPost: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where: { userId } }),
    ]);

    res.json({
      message: 'User comments retrieved successfully',
      data: comments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({ error: 'Failed to fetch user comments' });
  }
};
