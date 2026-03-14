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
 * Get all community posts with pagination
 * GET /api/v1/community/posts
 */
export const getCommunityPosts = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const { tag, sortBy } = req.query;

    const where: any = {};

    // Filter by tag if provided
    if (tag) {
      where.tags = { contains: tag as string };
    }

    // Determine sort order
    const orderBy: any = {};
    if (sortBy === 'trending') {
      orderBy.viewCount = 'desc';
    } else if (sortBy === 'popular') {
      orderBy.likes = 'desc';
    } else {
      orderBy.createdAt = 'desc'; // default: newest first
    }

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy,
      }),
      prisma.communityPost.count({ where }),
    ]);

    // Transform response to include comment count
    const transformedPosts = posts.map((post) => ({
      ...post,
      commentCount: post._count.comments,
      _count: undefined,
    }));

    res.json({
      message: 'Community posts retrieved successfully',
      data: transformedPosts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
};

/**
 * Get single community post by ID
 * GET /api/v1/community/posts/:id
 */
export const getCommunityPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.communityPost.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    await prisma.communityPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({
      message: 'Post retrieved successfully',
      data: {
        ...post,
        commentCount: post._count.comments,
        _count: undefined,
      },
    });
  } catch (error: any) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

/**
 * Create community post
 * POST /api/v1/community/posts
 */
export const createCommunityPost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { title, content, tags } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (title.length < 5 || title.length > 200) {
      return res.status(400).json({ error: 'Title must be between 5 and 200 characters' });
    }

    if (content.length < 10 || content.length > 5000) {
      return res.status(400).json({ error: 'Content must be between 10 and 5000 characters' });
    }

    const post = await prisma.communityPost.create({
      data: {
        userId,
        title,
        content,
        tags: tags ? JSON.stringify(tags) : '[]',
        viewCount: 0,
        likes: 0,
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
      message: 'Post created successfully',
      data: post,
    });
  } catch (error: any) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

/**
 * Update community post
 * PUT /api/v1/community/posts/:id
 */
export const updateCommunityPost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, content, tags } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if post exists and belongs to user
    const existingPost = await prisma.communityPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.userId !== userId && req.userRole !== 'MODERATOR') {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }

    const post = await prisma.communityPost.update({
      where: { id },
      data: {
        title: title || existingPost.title,
        content: content || existingPost.content,
        tags: tags ? JSON.stringify(tags) : existingPost.tags,
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
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error: any) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

/**
 * Delete community post
 * DELETE /api/v1/community/posts/:id
 */
export const deleteCommunityPost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const post = await prisma.communityPost.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== userId && req.userRole !== 'MODERATOR') {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    // Delete associated comments first
    await prisma.comment.deleteMany({
      where: { communityPostId: id },
    });

    await prisma.communityPost.delete({
      where: { id },
    });

    res.json({
      message: 'Post deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

/**
 * Like a community post
 * POST /api/v1/community/posts/:id/like
 */
export const likePost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const post = await prisma.communityPost.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Update like count
    const updatedPost = await prisma.communityPost.update({
      where: { id },
      data: {
        likes: { increment: 1 },
      },
    });

    res.json({
      message: 'Post liked successfully',
      data: { likes: updatedPost.likes },
    });
  } catch (error: any) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
};

/**
 * Get posts by specific user
 * GET /api/v1/community/users/:userId/posts
 */
export const getUserPosts = async (req: Request, res: Response) => {
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

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communityPost.count({ where: { userId } }),
    ]);

    const transformedPosts = posts.map((post) => ({
      ...post,
      commentCount: post._count.comments,
      _count: undefined,
    }));

    res.json({
      message: 'User posts retrieved successfully',
      data: transformedPosts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};

/**
 * Search community posts
 * GET /api/v1/community/posts/search
 */
export const searchCommunityPosts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    if (!query || typeof query !== 'string' || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where: {
          OR: [
            {
              title: { contains: query, mode: 'insensitive' },
            },
            {
              content: { contains: query, mode: 'insensitive' },
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communityPost.count({
        where: {
          OR: [
            {
              title: { contains: query, mode: 'insensitive' },
            },
            {
              content: { contains: query, mode: 'insensitive' },
            },
          ],
        },
      }),
    ]);

    const transformedPosts = posts.map((post) => ({
      ...post,
      commentCount: post._count.comments,
      _count: undefined,
    }));

    res.json({
      message: 'Search results retrieved successfully',
      data: transformedPosts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
};
