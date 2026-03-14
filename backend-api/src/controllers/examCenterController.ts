import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { validateExamCenterSearch, validateExamCenterCreate } from '../utils/validation';

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
 * Search exam centers with filters
 * GET /api/v1/exam-centers/search
 */
export const searchExamCenters = async (req: Request, res: Response) => {
  try {
    const { query, city, state, examType, limit, offset } = req.query;

    // Validate input
    const { error, value } = validateExamCenterSearch({
      query,
      city,
      state,
      examType,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const where: any = {};

    if (query) {
      where.OR = [
        { name: { contains: query as string, mode: 'insensitive' } },
        { location: { contains: query as string, mode: 'insensitive' } },
        { city: { contains: query as string, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (state) {
      where.state = { contains: state as string, mode: 'insensitive' };
    }

    if (examType) {
      where.examTypes = { contains: examType as string };
    }

    const [centers, total] = await Promise.all([
      prisma.examCenter.findMany({
        where,
        select: {
          id: true,
          name: true,
          location: true,
          city: true,
          state: true,
          latitude: true,
          longitude: true,
          capacity: true,
          examTypes: true,
          facilityDetails: true,
          contactEmail: true,
          contactPhone: true,
          createdAt: true,
        },
        take: value.limit,
        skip: value.offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.examCenter.count({ where }),
    ]);

    res.json({
      message: 'Exam centers retrieved successfully',
      data: centers,
      pagination: {
        total,
        limit: value.limit,
        offset: value.offset,
        hasMore: value.offset + value.limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error searching exam centers:', error);
    res.status(500).json({ error: 'Failed to search exam centers' });
  }
};

/**
 * Get all exam centers (with pagination)
 * GET /api/v1/exam-centers
 */
export const getAllExamCenters = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const [centers, total] = await Promise.all([
      prisma.examCenter.findMany({
        select: {
          id: true,
          name: true,
          location: true,
          city: true,
          state: true,
          latitude: true,
          longitude: true,
          capacity: true,
          examTypes: true,
          facilityDetails: true,
          contactEmail: true,
          contactPhone: true,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.examCenter.count(),
    ]);

    res.json({
      message: 'Exam centers retrieved successfully',
      data: centers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching exam centers:', error);
    res.status(500).json({ error: 'Failed to fetch exam centers' });
  }
};

/**
 * Get single exam center by ID
 * GET /api/v1/exam-centers/:id
 */
export const getExamCenterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const center = await prisma.examCenter.findUnique({
      where: { id },
      include: {
        reviews: {
          select: {
            id: true,
            userId: true,
            rating: true,
            title: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        stays: {
          select: {
            id: true,
            name: true,
            stayType: true,
            pricePerNight: true,
            rating: true,
          },
          take: 5,
        },
      },
    });

    if (!center) {
      return res.status(404).json({ error: 'Exam center not found' });
    }

    res.json({
      message: 'Exam center retrieved successfully',
      data: center,
    });
  } catch (error: any) {
    console.error('Error fetching exam center:', error);
    res.status(500).json({ error: 'Failed to fetch exam center' });
  }
};

/**
 * Create exam center (admin only)
 * POST /api/v1/exam-centers
 */
export const createExamCenter = async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create exam centers' });
    }

    // Validate input
    const { error, value } = validateExamCenterCreate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const center = await prisma.examCenter.create({
      data: {
        name: value.name,
        location: value.location || value.city,
        city: value.city,
        state: value.state,
        latitude: value.latitude || 0,
        longitude: value.longitude || 0,
        capacity: value.capacity || 0,
        examTypes: value.examTypes || '[]',
        facilityDetails: value.facilityDetails || '[]',
        contactEmail: value.contactEmail || '',
        contactPhone: value.contactPhone || '',
      },
    });

    res.status(201).json({
      message: 'Exam center created successfully',
      data: center,
    });
  } catch (error: any) {
    console.error('Error creating exam center:', error);
    res.status(500).json({ error: 'Failed to create exam center' });
  }
};

/**
 * Update exam center (admin only)
 * PUT /api/v1/exam-centers/:id
 */
export const updateExamCenter = async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can update exam centers' });
    }

    const { id } = req.params;

    // Check if center exists
    const existing = await prisma.examCenter.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Exam center not found' });
    }

    const center = await prisma.examCenter.update({
      where: { id },
      data: {
        name: req.body.name || existing.name,
        city: req.body.city || existing.city,
        state: req.body.state || existing.state,
        capacity: req.body.capacity !== undefined ? req.body.capacity : existing.capacity,
        contactEmail: req.body.contactEmail || existing.contactEmail,
        contactPhone: req.body.contactPhone || existing.contactPhone,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: 'Exam center updated successfully',
      data: center,
    });
  } catch (error: any) {
    console.error('Error updating exam center:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Exam center not found' });
    }
    res.status(500).json({ error: 'Failed to update exam center' });
  }
};

/**
 * Submit review for exam center
 * POST /api/v1/exam-centers/:id/reviews
 */
export const submitReview = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { rating, title, content } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    if (!rating || !title || !content) {
      return res.status(400).json({ error: 'Rating, title, and content are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if center exists
    const center = await prisma.examCenter.findUnique({ where: { id } });
    if (!center) {
      return res.status(404).json({ error: 'Exam center not found' });
    }

    // Check if user already reviewed this center
    const existingReview = await prisma.review.findFirst({
      where: {
        examCenterId: id,
        userId,
      },
    });

    let review;
    if (existingReview) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          title,
          content,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          userId,
          examCenterId: id,
          rating,
          title,
          content,
        },
      });
    }

    res.status(201).json({
      message: existingReview ? 'Review updated successfully' : 'Review submitted successfully',
      data: review,
    });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

/**
 * Get reviews for exam center
 * GET /api/v1/exam-centers/:id/reviews
 */
export const getExamCenterReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    // Check if center exists
    const center = await prisma.examCenter.findUnique({ where: { id } });
    if (!center) {
      return res.status(404).json({ error: 'Exam center not found' });
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { examCenterId: id },
        select: {
          id: true,
          rating: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { examCenterId: id } }),
    ]);

    res.json({
      message: 'Reviews retrieved successfully',
      data: reviews,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
