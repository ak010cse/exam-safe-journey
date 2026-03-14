import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/authRoutes';
import healthRouter from './routes/healthRoutes';
import userRouter from './routes/userRoutes';
import examCenterRouter from './routes/examCenterRoutes';
import travelRouter from './routes/travelRoutes';
import stayRouter from './routes/stayRoutes';
import notificationRouter from './routes/notificationRoutes';
import communityRouter from './routes/communityRoutes';
import partnerRouter from './routes/partnerRoutes';
import qaRouter from './routes/qaRoutes';
import adminRouter from './routes/adminRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app: Express = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit authentication requests to 5 per 15 minutes
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware (simple)
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/exam-centers', examCenterRouter);
app.use('/api/v1/travel', travelRouter);
app.use('/api/v1/stay', stayRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/community', communityRouter);
app.use('/api/v1/partners', partnerRouter);
app.use('/api/v1/qa', qaRouter);
app.use('/api/v1/admin', adminRouter);

// Health check without version prefix
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// API Documentation placeholder
app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Exam Safe Journey API v1',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      examCenters: '/api/v1/exam-centers',
      travel: '/api/v1/travel',
      stay: '/api/v1/stay',
      notifications: '/api/v1/notifications',
      community: '/api/v1/community',
      partners: '/api/v1/partners',
      qa: '/api/v1/qa',
      admin: '/api/v1/admin (ADMIN ONLY)',
      health: '/api/v1/health',
    },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
