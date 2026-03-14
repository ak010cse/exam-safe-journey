import express, { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router: Router = express.Router();

// Apply authentication to all admin routes
router.use(authenticate);

// ===== USER MANAGEMENT =====
// GET - All users with pagination and search
router.get('/users', adminController.getAllUsers);

// GET - Single user details with activity
router.get('/users/:userId', adminController.getUserDetails);

// PUT - Update user role (user, moderator, admin)
router.put('/users/:userId/role', adminController.updateUserRole);

// POST - Ban user from platform
router.post('/users/:userId/ban', adminController.banUser);

// POST - Unban user
router.post('/users/:userId/unban', adminController.unbanUser);

// ===== CONTENT MODERATION =====
// GET - All flagged content pending review
router.get('/flagged-content', adminController.getFlaggedContent);

// PUT - Moderate flagged content (approve, reject, delete)
router.put('/flagged-content/:flagId', adminController.moderateContent);

// GET - Posts for moderation
router.get('/moderation/posts', adminController.getPostsForModeration);

// ===== ANALYTICS & REPORTING =====
// GET - Dashboard statistics overview
router.get('/dashboard/stats', adminController.getDashboardStats);

// GET - User growth over time
router.get('/analytics/user-growth', adminController.getUserGrowth);

// GET - Engagement metrics and top contributors
router.get('/analytics/engagement', adminController.getEngagementMetrics);

// GET - Activity logs
router.get('/analytics/activity-log', adminController.getActivityLog);

// ===== SYSTEM MANAGEMENT =====
// GET - System health and status
router.get('/system/health', adminController.getSystemHealth);

// GET - Moderator statistics
router.get('/system/moderators', adminController.getModeratorStats);

// POST - Promote user to moderator
router.post('/system/moderators', adminController.createModerator);

export default router;
