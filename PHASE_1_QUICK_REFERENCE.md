# Phase 1 Quick Reference Guide

## Getting Started with Phase 1 Setup

### Prerequisites
- Git
- Node.js 18+ (or Docker)
- PostgreSQL 12+ (or Docker)
- Redis (or Docker)

### Quick Start (with Docker - Recommended)

```bash
# From project root
docker-compose up

# API will be available at http://localhost:3001
```

### Quick Start (Local Setup)

```bash
# Backend setup
cd backend-api
npm install

# Create .env file
cp .env.example .env

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/exam_journey_db

# Run migrations
npm run migrate

# Start dev server
npm run dev
```

### Testing Authentication Endpoints

**Register**:
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

**Get Current User** (with token):
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Key Files to Review

1. **Backend API**
   - `backend-api/src/app.ts` - Express app setup
   - `backend-api/prisma/schema.prisma` - Database schema
   - `backend-api/src/controllers/authController.ts` - Auth logic
   - `backend-api/README.md` - Full documentation

2. **Docker**
   - `docker-compose.yml` - Development environment

3. **CI/CD**
   - `.github/workflows/ci-cd.yml` - GitHub Actions

### Environment Variables

Create `backend-api/.env`:
```
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://exam_user:exam_password@localhost:5432/exam_journey_db
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production
REDIS_URL=redis://localhost:6379
```

### Database Migrations

```bash
# Create new migration
npm run migrate

# In production
npm run migrate:prod
```

### npm Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript
npm start            # Run production build
npm run lint         # Run ESLint
npm test             # Run tests
npm run migrate      # Run Prisma migrations
npm run migrate:prod # Production migration
```

### Project Structure Reference

```
backend-api/
├── src/
│   ├── controllers/  → Request handlers
│   ├── services/     → Business logic (ready for Phase 2)
│   ├── models/       → Data models (ready for Phase 2)
│   ├── middleware/   → Auth, error handling
│   ├── routes/       → API routes
│   ├── utils/        → Helper functions
│   └── database/     → Prisma setup
├── prisma/
│   └── schema.prisma → Database schema
└── .env.example      → Environment template
```

## Phase 1 Completion Summary

**Implemented**:
- ✅ Express API with TypeScript
- ✅ PostgreSQL with Prisma ORM
- ✅ JWT authentication
- ✅ Rate limiting & security
- ✅ Docker environment
- ✅ CI/CD pipeline
- ✅ Comprehensive database schema

**Ready For**:
- Frontend integration
- Phase 2 API development
- Team onboarding

## Troubleshooting

### Database Connection Error
```
Error: ECONNREFUSED
```
**Solution**: Ensure PostgreSQL is running and DATABASE_URL is correct

### Port Already in Use
```
Error: listen EADDRINUSE :::3001
```
**Solution**: Change PORT in .env or kill process on port 3001

### Docker Issues
```bash
# Rebuild containers
docker-compose restart

# Check logs
docker-compose logs -f api

# Reset everything
docker-compose down -v
docker-compose up
```

### Missing TypeScript Definitions
```bash
npm install --save-dev @types/express @types/node
```

## Next: Phase 2 Ready?

Review PHASE_1_COMPLETION_REPORT.md for full details.

When ready to proceed, confirm to start Phase 2: Core Platform Features.
