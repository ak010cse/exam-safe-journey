import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  searchExamCenters,
  getAllExamCenters,
  getExamCenterById,
  createExamCenter,
  updateExamCenter,
  submitReview,
  getExamCenterReviews,
} from '../controllers/examCenterController';

const router = Router();

// Public endpoints
router.get('/search', searchExamCenters);
router.get('/', getAllExamCenters);
router.get('/:id', getExamCenterById);
router.get('/:id/reviews', getExamCenterReviews);

// Protected endpoints
router.post('/:id/reviews', authMiddleware, submitReview);

// Admin-only endpoints
router.post('/', authMiddleware, createExamCenter);
router.put('/:id', authMiddleware, updateExamCenter);

export default router;
