import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { validateUserUpdate, validatePreferencesUpdate } from '../utils/validation';

// Extend Express Request to include user data from auth middleware
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
 * Get current user profile
 * GET /api/v1/users/profile
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User profile retrieved successfully',
      data: user,
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

/**
 * Update user profile
 * PUT /api/v1/users/profile
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    const { error, value } = validateUserUpdate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Get user preferences
 * GET /api/v1/users/preferences
 */
export const getUserPreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        preferences: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = user.preferences ? JSON.parse(user.preferences) : {};

    res.json({
      message: 'User preferences retrieved successfully',
      data: preferences,
    });
  } catch (error: any) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
};

/**
 * Update user preferences
 * PUT /api/v1/users/preferences
 */
export const updateUserPreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    const { error, value } = validatePreferencesUpdate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: JSON.stringify(value),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        preferences: true,
        updatedAt: true,
      },
    });

    const preferences = user.preferences ? JSON.parse(user.preferences) : {};

    res.json({
      message: 'Preferences updated successfully',
      data: preferences,
    });
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

/**
 * Get user's saved exam centers
 * GET /api/v1/users/saved/centers
 */
export const getSavedCenters = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [centers, total] = await Promise.all([
      prisma.savedCenter.findMany({
        where: { userId },
        include: {
          examCenter: {
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
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.savedCenter.count({ where: { userId } }),
    ]);

    res.json({
      message: 'Saved centers retrieved successfully',
      data: centers.map((item) => item.examCenter),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching saved centers:', error);
    res.status(500).json({ error: 'Failed to fetch saved centers' });
  }
};

/**
 * Get user's saved travel routes
 * GET /api/v1/users/saved/routes
 */
export const getSavedRoutes = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [routes, total] = await Promise.all([
      prisma.savedRoute.findMany({
        where: { userId },
        include: {
          travelRoute: {
            select: {
              id: true,
              origin: true,
              destination: true,
              transportMode: true,
              distance: true,
              estimatedDuration: true,
              basePrice: true,
              providers: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.savedRoute.count({ where: { userId } }),
    ]);

    res.json({
      message: 'Saved routes retrieved successfully',
      data: routes.map((item) => item.travelRoute),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching saved routes:', error);
    res.status(500).json({ error: 'Failed to fetch saved routes' });
  }
};

/**
 * Get user's saved stay listings
 * GET /api/v1/users/saved/stays
 */
export const getSavedStays = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [stays, total] = await Promise.all([
      prisma.savedStay.findMany({
        where: { userId },
        include: {
          stayListing: {
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
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.savedStay.count({ where: { userId } }),
    ]);

    res.json({
      message: 'Saved stays retrieved successfully',
      data: stays.map((item) => item.stayListing),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching saved stays:', error);
    res.status(500).json({ error: 'Failed to fetch saved stays' });
  }
};

/**
 * Save an exam center
 * POST /api/v1/users/saved/centers/:centerId
 */
export const saveCenter = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { centerId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if center exists
    const center = await prisma.examCenter.findUnique({
      where: { id: centerId },
    });

    if (!center) {
      return res.status(404).json({ error: 'Exam center not found' });
    }

    // Check if already saved
    const existing = await prisma.savedCenter.findUnique({
      where: {
        userId_examCenterId: {
          userId,
          examCenterId: centerId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Center already saved' });
    }

    await prisma.savedCenter.create({
      data: {
        userId,
        examCenterId: centerId,
      },
    });

    res.status(201).json({
      message: 'Center saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving center:', error);
    res.status(500).json({ error: 'Failed to save center' });
  }
};

/**
 * Remove a saved exam center
 * DELETE /api/v1/users/saved/centers/:centerId
 */
export const unsaveCenter = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { centerId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.savedCenter.deleteMany({
      where: {
        userId,
        examCenterId: centerId,
      },
    });

    res.json({
      message: 'Center removed from saved items',
    });
  } catch (error: any) {
    console.error('Error removing saved center:', error);
    res.status(500).json({ error: 'Failed to remove center' });
  }
};
