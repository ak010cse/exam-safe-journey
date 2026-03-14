# Exam Safe Journey - Backend API

Backend API for the Exam Safe Journey platform built with Node.js, Express, and PostgreSQL.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

Update `.env` with your configuration:
- Database URL
- JWT secrets
- SMTP credentials
- API keys

3. Setup database:
```bash
npm run migrate
```

4. Start development server:
```bash
npm run dev
```

The API will be running at `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run watch` - Watch TypeScript files for changes
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run migrate` - Run Prisma migrations
- `npm run migrate:prod` - Run migrations in production

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user (protected)
- `POST /api/v1/auth/logout` - Logout user (protected)

### Health Check
- `GET /api/v1/health` - Health check endpoint
- `GET /health` - Quick health check

## Project Structure

```
src/
├── controllers/      # Request handlers
├── services/         # Business logic
├── models/          # Data models
├── middleware/      # Express middleware
├── routes/          # Route definitions
├── utils/           # Utility functions
├── database/        # Database setup
├── app.ts           # Express app configuration
└── index.ts         # Application entry point

prisma/
└── schema.prisma    # Database schema
```

## Database Schema

Key entities:
- **User** - Platform users with roles
- **ExamCenter** - Exam center information
- **TravelRoute** - Transportation routes
- **StayListing** - Accommodation listings
- **CommunityPost** - User-generated posts
- **JourneyPartner** - Partner matching
- **Notification** - User notifications

## Security Features

- JWT authentication with access and refresh tokens
- Password hashing with bcryptjs
- Rate limiting on auth endpoints
- CORS configuration
- Helmet for HTTP headers
- Input validation with Joi
- Environment variable management

## Error Handling

All API responses follow a consistent format:

Success:
```json
{
  "message": "Success message",
  "data": { ... }
}
```

Error:
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push and create a PR

## License

MIT
