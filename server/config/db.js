const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const connStr = process.env.MONGODB_URI || 'mongodb+srv://smarthire_app:SmartHire2026@cluster0.a9yq1.mongodb.net/smarthire?retryWrites=true&w=majority';

  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Atlas connection failed (${err.message}). Trying MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] In-Memory MongoDB Server running at: ${mongoUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[Database Error] Failed to initialize in-memory DB: ${memErr.message}`);
    }
  }
};

module.exports = connectDB;
