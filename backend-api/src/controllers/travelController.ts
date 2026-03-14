import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { validateTravelRouteSearch } from '../utils/validation';

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
 * Search travel routes
 * GET /api/v1/travel/routes/search
 */
export const searchTravelRoutes = async (req: Request, res: Response) => {
  try {
    const { origin, destination, transportMode, limit, offset } = req.query;

    // Validate input
    const { error, value } = validateTravelRouteSearch({
      origin,
      destination,
      transportMode,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const where: any = {
      origin: { contains: value.origin, mode: 'insensitive' },
      destination: { contains: value.destination, mode: 'insensitive' },
    };

    if (value.transportMode) {
      where.transportMode = value.transportMode;
    }

    const [routes, total] = await Promise.all([
      prisma.travelRoute.findMany({
        where,
        select: {
          id: true,
          origin: true,
          destination: true,
          transportMode: true,
          distance: true,
          estimatedDuration: true,
          basePrice: true,
          providers: true,
          operatingDays: true,
        },
        take: value.limit,
        skip: value.offset,
        orderBy: { basePrice: 'asc' },
      }),
      prisma.travelRoute.count({ where }),
    ]);

    res.json({
      message: 'Travel routes found',
      data: routes,
      pagination: {
        total,
        limit: value.limit,
        offset: value.offset,
        hasMore: value.offset + value.limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error searching travel routes:', error);
    res.status(500).json({ error: 'Failed to search travel routes' });
  }
};

/**
 * Get all travel routes
 * GET /api/v1/travel/routes
 */
export const getAllTravelRoutes = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const { transportMode } = req.query;

    const where: any = {};
    if (transportMode) {
      where.transportMode = transportMode;
    }

    const [routes, total] = await Promise.all([
      prisma.travelRoute.findMany({
        where,
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
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.travelRoute.count({ where }),
    ]);

    res.json({
      message: 'Travel routes retrieved successfully',
      data: routes,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching travel routes:', error);
    res.status(500).json({ error: 'Failed to fetch travel routes' });
  }
};

/**
 * Get single travel route by ID
 * GET /api/v1/travel/routes/:id
 */
export const getTravelRouteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const route = await prisma.travelRoute.findUnique({
      where: { id },
    });

    if (!route) {
      return res.status(404).json({ error: 'Travel route not found' });
    }

    res.json({
      message: 'Travel route retrieved successfully',
      data: route,
    });
  } catch (error: any) {
    console.error('Error fetching travel route:', error);
    res.status(500).json({ error: 'Failed to fetch travel route' });
  }
};

/**
 * Create travel route (admin only)
 * POST /api/v1/travel/routes
 */
export const createTravelRoute = async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create travel routes' });
    }

    const {
      origin,
      destination,
      transportMode,
      distance,
      estimatedDuration,
      basePrice,
      operatingDays,
      providers,
    } = req.body;

    // Validate required fields
    if (!origin || !destination || !transportMode || basePrice === undefined) {
      return res.status(400).json({ error: 'Required fields: origin, destination, transportMode, basePrice' });
    }

    const route = await prisma.travelRoute.create({
      data: {
        origin,
        destination,
        transportMode,
        distance: distance || 0,
        estimatedDuration: estimatedDuration || 0,
        basePrice,
        operatingDays: operatingDays ? JSON.stringify(operatingDays) : '[]',
        providers: providers ? JSON.stringify(providers) : '[]',
      },
    });

    res.status(201).json({
      message: 'Travel route created successfully',
      data: route,
    });
  } catch (error: any) {
    console.error('Error creating travel route:', error);
    res.status(500).json({ error: 'Failed to create travel route' });
  }
};

/**
 * Update travel route (admin only)
 * PUT /api/v1/travel/routes/:id
 */
export const updateTravelRoute = async (req: Request, res: Response) => {
  try {
    // Check admin role
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can update travel routes' });
    }

    const { id } = req.params;

    // Check if route exists
    const existing = await prisma.travelRoute.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Travel route not found' });
    }

    const route = await prisma.travelRoute.update({
      where: { id },
      data: {
        origin: req.body.origin || existing.origin,
        destination: req.body.destination || existing.destination,
        transportMode: req.body.transportMode || existing.transportMode,
        distance: req.body.distance !== undefined ? req.body.distance : existing.distance,
        estimatedDuration: req.body.estimatedDuration !== undefined ? req.body.estimatedDuration : existing.estimatedDuration,
        basePrice: req.body.basePrice !== undefined ? req.body.basePrice : existing.basePrice,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: 'Travel route updated successfully',
      data: route,
    });
  } catch (error: any) {
    console.error('Error updating travel route:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Travel route not found' });
    }
    res.status(500).json({ error: 'Failed to update travel route' });
  }
};

/**
 * Get popular routes (trending)
 * GET /api/v1/travel/routes/trending
 */
export const getTrendingRoutes = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    const routes = await prisma.travelRoute.findMany({
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
      orderBy: { viewCount: 'desc' },
      take: limit,
    });

    res.json({
      message: 'Trending routes retrieved successfully',
      data: routes,
    });
  } catch (error: any) {
    console.error('Error fetching trending routes:', error);
    res.status(500).json({ error: 'Failed to fetch trending routes' });
  }
};

/**
 * Save travel route
 * POST /api/v1/travel/routes/:id/save
 */
export const saveTravelRoute = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if route exists
    const route = await prisma.travelRoute.findUnique({
      where: { id },
    });

    if (!route) {
      return res.status(404).json({ error: 'Travel route not found' });
    }

    // Check if already saved
    const existing = await prisma.savedRoute.findUnique({
      where: {
        userId_travelRouteId: {
          userId,
          travelRouteId: id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Route already saved' });
    }

    await prisma.savedRoute.create({
      data: {
        userId,
        travelRouteId: id,
      },
    });

    res.status(201).json({
      message: 'Route saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving route:', error);
    res.status(500).json({ error: 'Failed to save route' });
  }
};
