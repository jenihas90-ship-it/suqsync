import dotenv from 'dotenv';
import { connectDB, getMongoStatus } from './config/db.js';
import { DataStore } from './config/store.js';

dotenv.config();

const runSeed = async () => {
  await connectDB();
  await DataStore.seedMongoIfEmpty();
  console.log(`Database seeded with Ethiopian starter catalog.`);
  process.exit(0);
};

runSeed();
