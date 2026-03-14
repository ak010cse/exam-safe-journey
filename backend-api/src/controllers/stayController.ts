import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { validateStayListingSearch } from '../utils/validation';

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
 * Search stay listings
 * GET /api/v1/stay/listings/search
 */
export const searchStayListings = async (req: Request, res: Response) => {
  try {
    const { city, examCenterId, stayType, minPrice, maxPrice, minRating, limit, offset } = req.query;

    // Validate input
    const { error, value } = validateStayListingSearch({
      city,
      examCenterId,
      stayType,
      minPrice: minPrice ? parseInt(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const where: any = {};

    if (value.city) {
      where.city = { contains: value.city, mode: 'insensitive' };
    }

    if (value.examCenterId) {
      where.examCenterId = value.examCenterId;
    }

    if (value.stayType) {
      where.stayType = value.stayType;
    }

    if (value.minPrice !== undefined || value.maxPrice !== undefined) {
      where.pricePerNight = {};
      if (value.minPrice !== undefined) where.pricePerNight.gte = value.minPrice;
      if (value.maxPrice !== undefined) where.pricePerNight.lte = value.maxPrice;
    }

    if (value.minRating !== undefined) {
      where.rating = { gte: value.minRating };
    }

    const [listings, total] = await Promise.all([
      prisma.stayListing.findMany({
        where,
        select: {
          id: true,
          name: true,
          city: true,
          address: true,
          stayType: true,
          pricePerNight: true,
          rating: true,
          reviewCount: true,
          amenities: true,
          availableRooms: true,
          examCenter: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        take: value.limit,
        skip: value.offset,
        orderBy: { rating: 'desc' },
      }),
      prisma.stayListing.count({ where }),
    ]);

    res.json({
      message: 'Stay listings found',
      data: listings,
      pagination: {
        total,
        limit: value.limit,
        offset: value.offset,
        hasMore: value.offset + value.limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error searching stay listings:', error);
    res.status(500).json({ error: 'Failed to search stay listings' });
  }
};

/**
 * Get all stay listings
 * GET /api/v1/stay/listings
 */
export const getAllStayListings = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const { city, stayType } = req.query;

    const where: any = {};
    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }
    if (stayType) {
      where.stayType = stayType;
    }

    const [listings, total] = await Promise.all([
      prisma.stayListing.findMany({
        where,
        select: {
          id: true,
          name: true,
          city: true,
          address: true,
          stayType: true,
          pricePerNight: true,
          rating: true,
          reviewCount: true,
          amenities: true,
          availableRooms: true,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.stayListing.count({ where }),
    ]);

    res.json({
      message: 'Stay listings retrieved successfully',
      data: listings,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching stay listings:', error);
    res.status(500).json({ error: 'Failed to fetch stay listings' });
  }
};

/**
 * Get single stay listing by ID
 * GET /api/v1/stay/listings/:id
 */
export const getStayListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await prisma.stayListing.findUnique({
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
          take: 8,
        },
        examCenter: {
          select: {
            id: true,
            name: true,
            location: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Stay listing not found' });
    }

    res.json({
      message: 'Stay listing retrieved successfully',
      data: listing,
    });
  } catch (error: any) {
    console.error('Error fetching stay listing:', error);
    res.status(500).json({ error: 'Failed to fetch stay listing' });
  }
};

/**
 * Create stay listing (admin only)
 * POST /api/v1/stay/listings
 */
export const createStayListing = async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create stay listings' });
    }

    const {
      name,
      examCenterId,
      city,
      address,
      stayType,
      pricePerNight,
      amenities,
      availableRooms,
      contactEmail,
      contactPhone,
    } = req.body;

    // Validate required fields
    if (!name || !examCenterId || !city || !address || !stayType || pricePerNight === undefined) {
      return res
        .status(400)
        .json({ error: 'Required fields: name, examCenterId, city, address, stayType, pricePerNight' });
    }

    // Verify exam center exists
    const center = await prisma.examCenter.findUnique({
      where: { id: examCenterId },
    });

    if (!center) {
      return res.status(404).json({ error: 'Exam center not found' });
    }

    const listing = await prisma.stayListing.create({
      data: {
        name,
        examCenterId,
        city,
        address,
        stayType,
        pricePerNight,
        amenities: amenities ? JSON.stringify(amenities) : '[]',
        availableRooms: availableRooms || 0,
        contactEmail: contactEmail || '',
        contactPhone: contactPhone || '',
        rating: 0,
        reviewCount: 0,
      },
    });

    res.status(201).json({
      message: 'Stay listing created successfully',
      data: listing,
    });
  } catch (error: any) {
    console.error('Error creating stay listing:', error);
    res.status(500).json({ error: 'Failed to create stay listing' });
  }
};

/**
 * Update stay listing (admin only)
 * PUT /api/v1/stay/listings/:id
 */
export const updateStayListing = async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can update stay listings' });
    }

    const { id } = req.params;

    // Check if listing exists
    const existing = await prisma.stayListing.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Stay listing not found' });
    }

    const listing = await prisma.stayListing.update({
      where: { id },
      data: {
        name: req.body.name || existing.name,
        city: req.body.city || existing.city,
        address: req.body.address || existing.address,
        pricePerNight: req.body.pricePerNight !== undefined ? req.body.pricePerNight : existing.pricePerNight,
        availableRooms: req.body.availableRooms !== undefined ? req.body.availableRooms : existing.availableRooms,
        contactEmail: req.body.contactEmail || existing.contactEmail,
        contactPhone: req.body.contactPhone || existing.contactPhone,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: 'Stay listing updated successfully',
      data: listing,
    });
  } catch (error: any) {
    console.error('Error updating stay listing:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Stay listing not found' });
    }
    res.status(500).json({ error: 'Failed to update stay listing' });
  }
};

/**
 * Get reviews for stay listing
 * GET /api/v1/stay/listings/:id/reviews
 */
export const getStayReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    // Check if listing exists
    const listing = await prisma.stayListing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ error: 'Stay listing not found' });
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { stayListingId: id },
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
      prisma.review.count({ where: { stayListingId: id } }),
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

/**
 * Submit review for stay listing
 * POST /api/v1/stay/listings/:id/reviews
 */
export const submitStayReview = async (req: Request, res: Response) => {
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

    // Check if listing exists
    const listing = await prisma.stayListing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ error: 'Stay listing not found' });
    }

    // Check if user already reviewed this listing
    const existingReview = await prisma.review.findFirst({
      where: {
        stayListingId: id,
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
          stayListingId: id,
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
 * Save stay listing
 * POST /api/v1/stay/listings/:id/save
 */
export const saveStayListing = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if listing exists
    const listing = await prisma.stayListing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Stay listing not found' });
    }

    // Check if already saved
    const existing = await prisma.savedStay.findUnique({
      where: {
        userId_stayListingId: {
          userId,
          stayListingId: id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Stay already saved' });
    }

    await prisma.savedStay.create({
      data: {
        userId,
        stayListingId: id,
      },
    });

    res.status(201).json({
      message: 'Stay saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving stay:', error);
    res.status(500).json({ error: 'Failed to save stay' });
  }
};

/**
 * Get popular stay listings
 * GET /api/v1/stay/listings/popular
 */
export const getPopularStays = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    const listings = await prisma.stayListing.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        address: true,
        stayType: true,
        pricePerNight: true,
        rating: true,
        reviewCount: true,
      },
      orderBy: { reviewCount: 'desc' },
      take: limit,
    });

    res.json({
      message: 'Popular stays retrieved successfully',
      data: listings,
    });
  } catch (error: any) {
    console.error('Error fetching popular stays:', error);
    res.status(500).json({ error: 'Failed to fetch popular stays' });
  }
};
