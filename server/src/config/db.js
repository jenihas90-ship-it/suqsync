import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/suqsync';
  try {
    mongoose.set('strictQuery', false);
    // Try connecting with a 3-second timeout so startup isn't delayed if no mongo daemon exists
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`[SuqSync DB] MongoDB Connected successfully: ${mongoose.connection.host}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[SuqSync DB] MongoDB unavailable (${err.message}). Using local JSON/Memory store fallback.`);
  }
};

export const getMongoStatus = () => ({
  connected: isMongoConnected,
  mode: isMongoConnected ? 'MongoDB (Mongoose)' : 'Local Persistent JSON Store',
  uri: isMongoConnected ? (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/suqsync') : null
});
