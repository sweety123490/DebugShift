import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Try connecting to configured MongoDB URI if provided
  if (uri && uri !== 'mongodb://localhost:27017/contextshift_inmemory') {
    try {
      console.log(`[DB] Attempting connection to MongoDB at: ${uri.split('@').pop()}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`[DB] ✅ MongoDB Connected Successfully! (Host: ${conn.connection.host})`);
      return;
    } catch (err) {
      console.warn(`[DB] Warning: Could not connect to remote/local MongoDB (${err.message}).`);
      console.log('[DB] Initializing embedded MongoDB Memory Server for seamless zero-config local run...');
    }
  }

  // Graceful fallback to MongoMemoryServer
  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[DB] In-Memory MongoDB Server started and connected: ${conn.connection.host}`);
    console.log('[DB] Ready for local development, challenges seeding, and testing!');
  } catch (memErr) {
    console.error('[DB] Fatal error initializing MongoDB:', memErr.message);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
