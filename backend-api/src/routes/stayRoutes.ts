import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  searchStayListings,
  getAllStayListings,
  getStayListingById,
  createStayListing,
  updateStayListing,
  getStayReviews,
  submitStayReview,
  saveStayListing,
  getPopularStays,
} from '../controllers/stayController';

const router = Router();

// Public endpoints
router.get('/search', searchStayListings);
router.get('/popular', getPopularStays);
router.get('/', getAllStayListings);
router.get('/:id', getStayListingById);
router.get('/:id/reviews', getStayReviews);

// Protected endpoints
router.post('/:id/reviews', authMiddleware, submitStayReview);
router.post('/:id/save', authMiddleware, saveStayListing);

// Admin-only endpoints
router.post('/', authMiddleware, createStayListing);
router.put('/:id', authMiddleware, updateStayListing);

export default router;
