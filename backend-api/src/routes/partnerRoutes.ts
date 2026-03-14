import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createPartnerProfile,
  getPartnerProfile,
  findMatches,
  getPartnerById,
  togglePartnerProfileStatus,
  browseCommunityPartners,
  sendConnectionRequest,
} from '../controllers/partnerController';

const router = Router();

// Public endpoints
router.get('/browse', browseCommunityPartners);
router.get('/:partnerId', getPartnerById);

// Protected endpoints
router.post('/profile', authMiddleware, createPartnerProfile);
router.get('/profile', authMiddleware, getPartnerProfile);
router.get('/matches', authMiddleware, findMatches);
router.put('/profile/toggle', authMiddleware, togglePartnerProfileStatus);
router.post('/:partnerId/connect', authMiddleware, sendConnectionRequest);

export default router;
