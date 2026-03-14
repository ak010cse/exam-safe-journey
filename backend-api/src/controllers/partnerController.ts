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
 * Create or update journey partner profile
 * POST /api/v1/partners/profile
 */
export const createPartnerProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { matchCriteria } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate matchCriteria
    if (!matchCriteria || typeof matchCriteria !== 'object') {
      return res.status(400).json({ error: 'Match criteria is required' });
    }

    // Check if profile already exists
    const existingProfile = await prisma.journeyPartner.findFirst({
      where: { userId },
    });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.journeyPartner.update({
        where: { id: existingProfile.id },
        data: {
          matchCriteria: JSON.stringify(matchCriteria),
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      });
    } else {
      // Create new profile
      profile = await prisma.journeyPartner.create({
        data: {
          userId,
          matchCriteria: JSON.stringify(matchCriteria),
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      });
    }

    res.status(existingProfile ? 200 : 201).json({
      message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
      data: profile,
    });
  } catch (error: any) {
    console.error('Error creating/updating partner profile:', error);
    res.status(500).json({ error: 'Failed to create/update profile' });
  }
};

/**
 * Get user's partner profile
 * GET /api/v1/partners/profile
 */
export const getPartnerProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await prisma.journeyPartner.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Partner profile not found' });
    }

    res.json({
      message: 'Partner profile retrieved successfully',
      data: profile,
    });
  } catch (error: any) {
    console.error('Error fetching partner profile:', error);
    res.status(500).json({ error: 'Failed to fetch partner profile' });
  }
};

/**
 * Find matching journey partners
 * GET /api/v1/partners/matches
 * 
 * Matching algorithm:
 * - Same exam type
 * - Same travel location or nearby
 * - Similar departure dates (within 7 days)
 * - Preferences sharing level
 */
export const findMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's partner profile
    const userProfile = await prisma.journeyPartner.findFirst({
      where: { userId, isActive: true },
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Your partner profile not found. Please create one first' });
    }

    const userCriteria = JSON.parse(userProfile.matchCriteria);

    // Find all active partner profiles
    const allProfiles = await prisma.journeyPartner.findMany({
      where: {
        isActive: true,
        NOT: { userId }, // Exclude self
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    // Scoring algorithm
    const scoredMatches = allProfiles
      .map((profile) => {
        const criteria = JSON.parse(profile.matchCriteria);
        let score = 0;

        // Exam type match (40 points)
        if (userCriteria.examType === criteria.examType) {
          score += 40;
        }

        // Location match (30 points)
        if (userCriteria.travelLocation?.toLowerCase() === criteria.travelLocation?.toLowerCase()) {
          score += 30;
        }

        // Departure date match within 7 days (20 points)
        if (userCriteria.departureDate && criteria.departureDate) {
          const userDate = new Date(userCriteria.departureDate);
          const matchDate = new Date(criteria.departureDate);
          const dayDiff = Math.abs((userDate.getTime() - matchDate.getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff <= 7) {
            score += 20;
          }
        }

        // Preferences sharing match (10 points)
        if (userCriteria.preferencesSharing === criteria.preferencesSharing) {
          score += 10;
        }

        return {
          ...profile,
          matchScore: score,
        };
      })
      .filter((match) => match.matchScore > 0) // Only matches with score > 0
      .sort((a, b) => b.matchScore - a.matchScore) // Sort by score descending
      .slice(0, limit);

    res.json({
      message: 'Matching partners found',
      data: scoredMatches,
      count: scoredMatches.length,
    });
  } catch (error: any) {
    console.error('Error finding matches:', error);
    res.status(500).json({ error: 'Failed to find matches' });
  }
};

/**
 * Get specific partner profile
 * GET /api/v1/partners/:partnerId
 */
export const getPartnerById = async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;

    const profile = await prisma.journeyPartner.findUnique({
      where: { id: partnerId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    if (!profile.isActive) {
      return res.status(404).json({ error: 'Partner profile is inactive' });
    }

    res.json({
      message: 'Partner profile retrieved successfully',
      data: profile,
    });
  } catch (error: any) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: 'Failed to fetch partner' });
  }
};

/**
 * Toggle partner profile active/inactive
 * PUT /api/v1/partners/profile/toggle
 */
export const togglePartnerProfileStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { isActive } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const profile = await prisma.journeyPartner.findFirst({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Partner profile not found' });
    }

    const updated = await prisma.journeyPartner.update({
      where: { id: profile.id },
      data: {
        isActive,
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
      message: `Profile ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error toggling profile status:', error);
    res.status(500).json({ error: 'Failed to toggle profile status' });
  }
};

/**
 * Get all active partners (browse)
 * GET /api/v1/partners/browse
 */
export const browseCommunityPartners = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const { examType, location } = req.query;

    const where: any = {
      isActive: true,
      NOT: userId ? { userId } : undefined,
    };

    // Filter by exam type if provided
    if (examType) {
      // Note: This is a simple contains search on the JSON field
      where.matchCriteria = { contains: examType as string };
    }

    // Filter by location if provided
    if (location) {
      where.matchCriteria = {
        contains: location as string,
      };
    }

    const [partners, total] = await Promise.all([
      prisma.journeyPartner.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.journeyPartner.count({ where }),
    ]);

    res.json({
      message: 'Partners retrieved successfully',
      data: partners,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error browsing partners:', error);
    res.status(500).json({ error: 'Failed to browse partners' });
  }
};

/**
 * Send connection request to partner
 * POST /api/v1/partners/:partnerId/connect
 */
export const sendConnectionRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { partnerId } = req.params;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if partner exists and is active
    const partner = await prisma.journeyPartner.findUnique({
      where: { id: partnerId },
    });

    if (!partner || !partner.isActive) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    if (partner.userId === userId) {
      return res.status(400).json({ error: 'Cannot connect with yourself' });
    }

    // Create notification for partner
    await prisma.notification.create({
      data: {
        userId: partner.userId,
        type: 'PARTNER_MATCH',
        title: 'New Connection Request',
        message: message || `You have a new connection request from a journey partner`,
        relatedId: userId,
      },
    });

    res.status(201).json({
      message: 'Connection request sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
};
