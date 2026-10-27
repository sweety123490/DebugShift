import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Ensure database contains debugging challenges
    await seedDatabase(false);

    const server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` ContextShift Backend API running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Gemini Model: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}`);
      console.log(` API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated.');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
