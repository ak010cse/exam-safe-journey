import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getQAQuestions,
  getQAQuestion,
  createQAQuestion,
  postAnswer,
  markAnswerHelpful,
  getQACategories,
  searchQA,
} from '../controllers/qaController';

const router = Router();

// Public endpoints
router.get('/search', searchQA);
router.get('/categories', getQACategories);
router.get('/questions', getQAQuestions);
router.get('/questions/:id', getQAQuestion);

// Protected endpoints
router.post('/questions', authMiddleware, createQAQuestion);
router.post('/questions/:questionId/answers', authMiddleware, postAnswer);
router.post('/answers/:answerId/helpful', authMiddleware, markAnswerHelpful);

export default router;
