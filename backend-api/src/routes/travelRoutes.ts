import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  searchTravelRoutes,
  getAllTravelRoutes,
  getTravelRouteById,
  createTravelRoute,
  updateTravelRoute,
  getTrendingRoutes,
  saveTravelRoute,
} from '../controllers/travelController';

const router = Router();

// Public endpoints
router.get('/search', searchTravelRoutes);
router.get('/trending', getTrendingRoutes);
router.get('/', getAllTravelRoutes);
router.get('/:id', getTravelRouteById);

// Protected endpoints
router.post('/:id/save', authMiddleware, saveTravelRoute);

// Admin-only endpoints
router.post('/', authMiddleware, createTravelRoute);
router.put('/:id', authMiddleware, updateTravelRoute);

export default router;
