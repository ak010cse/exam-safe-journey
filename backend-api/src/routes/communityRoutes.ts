import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getCommunityPosts,
  getCommunityPostById,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  likePost,
  getUserPosts,
  searchCommunityPosts,
} from '../controllers/communityController';
import {
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
  getUserComments,
} from '../controllers/commentController';

const router = Router();

// ===== COMMUNITY POSTS =====

// Public endpoints
router.get('/posts/search', searchCommunityPosts);
router.get('/posts', getCommunityPosts);
router.get('/posts/:id', getCommunityPostById);
router.get('/users/:userId/posts', getUserPosts);

// Protected endpoints
router.post('/posts', authMiddleware, createCommunityPost);
router.put('/posts/:id', authMiddleware, updateCommunityPost);
router.delete('/posts/:id', authMiddleware, deleteCommunityPost);
router.post('/posts/:id/like', authMiddleware, likePost);

// ===== COMMENTS =====

// Public endpoints
router.get('/posts/:postId/comments', getPostComments);
router.get('/users/:userId/comments', getUserComments);

// Protected endpoints
router.post('/posts/:postId/comments', authMiddleware, createComment);
router.put('/comments/:commentId', authMiddleware, updateComment);
router.delete('/comments/:commentId', authMiddleware, deleteComment);

export default router;
