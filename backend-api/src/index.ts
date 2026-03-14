import app from './app';
import { initializeDatabase } from './database/prisma';

const PORT = process.env.PORT || 3001;

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    // Initialize database
    await initializeDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║  Exam Safe Journey API                 ║`);
      console.log(`║  Server running on port ${PORT}              ║`);
      console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}           ║`);
      console.log(`╚════════════════════════════════════════╝\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();
