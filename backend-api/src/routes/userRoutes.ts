import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getUserProfile,
  updateUserProfile,
  getUserPreferences,
  updateUserPreferences,
  getSavedCenters,
  getSavedRoutes,
  getSavedStays,
  saveCenter,
  unsaveCenter,
} from '../controllers/userController';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Profile endpoints
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Preferences endpoints
router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);

// Saved items endpoints
router.get('/saved/centers', getSavedCenters);
router.get('/saved/routes', getSavedRoutes);
router.get('/saved/stays', getSavedStays);

// Save/unsave endpoints
router.post('/saved/centers/:centerId', saveCenter);
router.delete('/saved/centers/:centerId', unsaveCenter);

export default router;
