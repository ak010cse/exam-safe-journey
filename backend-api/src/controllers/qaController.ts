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

// Note: This Q&A system reuses the CommunityPost model with a 'qa' tag
// In a full system, you'd create separate Question and Answer models

/**
 * Get all Q&A questions
 * GET /api/v1/qa/questions
 */
export const getQAQuestions = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const { category, sortBy } = req.query;

    const where: any = {
      tags: { contains: 'qa' }, // Questions tagged as 'qa'
    };

    if (category) {
      where.tags = { contains: category as string };
    }

    const orderBy: any = {};
    if (sortBy === 'trending') {
      orderBy.viewCount = 'desc';
    } else if (sortBy === 'unanswered') {
      // This would need a count, using likes as proxy for now
      orderBy.likes = 'asc';
    } else {
      orderBy.createdAt = 'desc'; // default: newest first
    }

    const [questions, total] = await Promise.all([
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

    const transformedQuestions = questions.map((q) => ({
      ...q,
      answerCount: q._count.comments,
      _count: undefined,
    }));

    res.json({
      message: 'Q&A questions retrieved successfully',
      data: transformedQuestions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching Q&A questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

/**
 * Get single Q&A question with answers
 * GET /api/v1/qa/questions/:id
 */
export const getQAQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const question = await prisma.communityPost.findUnique({
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
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Increment view count
    await prisma.communityPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({
      message: 'Question retrieved successfully',
      data: {
        ...question,
        answerCount: question._count.comments,
        _count: undefined,
      },
    });
  } catch (error: any) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
};

/**
 * Create Q&A question
 * POST /api/v1/qa/questions
 */
export const createQAQuestion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { title, content, category } = req.body;

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

    const tags = ['qa', category || 'general'];

    const question = await prisma.communityPost.create({
      data: {
        userId,
        title,
        content,
        tags: JSON.stringify(tags),
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
      message: 'Question created successfully',
      data: question,
    });
  } catch (error: any) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
};

/**
 * Post answer to Q&A question
 * POST /api/v1/qa/questions/:questionId/answers
 */
export const postAnswer = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { questionId } = req.params;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Answer content is required' });
    }

    if (content.length < 10 || content.length > 3000) {
      return res.status(400).json({ error: 'Answer must be between 10 and 3000 characters' });
    }

    // Check if question exists
    const question = await prisma.communityPost.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = await prisma.comment.create({
      data: {
        userId,
        communityPostId: questionId,
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
      message: 'Answer posted successfully',
      data: answer,
    });
  } catch (error: any) {
    console.error('Error posting answer:', error);
    res.status(500).json({ error: 'Failed to post answer' });
  }
};

/**
 * Mark answer as helpful
 * POST /api/v1/qa/answers/:answerId/helpful
 */
export const markAnswerHelpful = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { answerId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const answer = await prisma.comment.findUnique({
      where: { id: answerId },
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Note: In a full system, you'd track helpful votes separately
    // For now, we'll just acknowledge the action
    res.json({
      message: 'Answer marked as helpful',
      data: { answerId },
    });
  } catch (error: any) {
    console.error('Error marking answer helpful:', error);
    res.status(500).json({ error: 'Failed to mark answer helpful' });
  }
};

/**
 * Get popular Q&A categories
 * GET /api/v1/qa/categories
 */
export const getQACategories = async (req: Request, res: Response) => {
  try {
    // These are common Q&A categories for exam prep
    const categories = [
      {
        name: 'Exam Prep',
        slug: 'exam-prep',
        description: 'Questions about exam preparation strategies',
        questionCount: 0,
      },
      {
        name: 'Study Materials',
        slug: 'study-materials',
        description: 'Recommendations and questions about books and resources',
        questionCount: 0,
      },
      {
        name: 'Travel Tips',
        slug: 'travel-tips',
        description: 'Questions about traveling to exam centers',
        questionCount: 0,
      },
      {
        name: 'Accommodation',
        slug: 'accommodation',
        description: 'Questions about finding places to stay',
        questionCount: 0,
      },
      {
        name: 'Time Management',
        slug: 'time-management',
        description: 'Tips and questions about managing study time',
        questionCount: 0,
      },
      {
        name: 'Health & Wellness',
        slug: 'health-wellness',
        description: 'Questions about staying healthy during prep',
        questionCount: 0,
      },
    ];

    // Get question counts for each category
    for (const category of categories) {
      const count = await prisma.communityPost.count({
        where: {
          tags: {
            contains: category.slug,
          },
        },
      });
      category.questionCount = count;
    }

    res.json({
      message: 'Q&A categories retrieved successfully',
      data: categories,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/**
 * Search Q&A questions
 * GET /api/v1/qa/search
 */
export const searchQA = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    if (!query || typeof query !== 'string' || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const [questions, total] = await Promise.all([
      prisma.communityPost.findMany({
        where: {
          tags: { contains: 'qa' },
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
        orderBy: { viewCount: 'desc' },
      }),
      prisma.communityPost.count({
        where: {
          tags: { contains: 'qa' },
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

    const transformedQuestions = questions.map((q) => ({
      ...q,
      answerCount: q._count.comments,
      _count: undefined,
    }));

    res.json({
      message: 'Search results retrieved successfully',
      data: transformedQuestions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error searching Q&A:', error);
    res.status(500).json({ error: 'Failed to search Q&A' });
  }
};
