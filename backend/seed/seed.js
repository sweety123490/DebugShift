import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import { challenges } from './seedData.js';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config();

export const seedDatabase = async (autoClose = false) => {
  try {
    console.log('[Seed] Checking challenge database status...');
    const count = await Challenge.countDocuments();

    if (count > 0) {
      console.log(`[Seed] Database already contains ${count} challenges. Seeding skipped.`);
      if (autoClose) await closeDB();
      return;
    }

    console.log('[Seed] Seeding default debugging challenges into MongoDB...');
    await Challenge.deleteMany({});
    const insertedChallenges = await Challenge.insertMany(challenges);
    console.log(`[Seed] Successfully inserted ${insertedChallenges.length} challenges!`);

    // Optionally create a sample demo test account if none exists
    const demoUser = await User.findOne({ email: 'demo@contextshift.dev' });
    if (!demoUser) {
      await User.create({
        name: 'Alex Developer',
        email: 'demo@contextshift.dev',
        password: 'Password123!',
      });
      console.log('[Seed] Created default test user: demo@contextshift.dev / Password123!');
    }

    if (autoClose) {
      console.log('[Seed] Seeding complete.');
      await closeDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
    if (autoClose) process.exit(1);
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase(true);
  })();
}
