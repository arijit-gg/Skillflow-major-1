const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Only attempt Atlas if user explicitly configured MONGODB_URI env var on Render
  if (process.env.MONGODB_URI) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 1500,
      });
      console.log(`[Database] Connected to MongoDB Atlas: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] MongoDB Atlas connection failed (${err.message}).`);
    }
  }

  // Attempt local MongoDB with fast 500ms timeout
  try {
    const connStr = 'mongodb://127.0.0.1:27017/smarthire';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 500,
    });
    console.log(`[Database] Connected to Local Mongo: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    // Silent cloud fallback
  }

  // Attempt MongoMemoryServer locally
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] In-Memory MongoDB Server running at: ${mongoUri}`);
      return conn;
    } catch (memErr) {
      console.warn(`[Database Warning] In-Memory DB unavailable.`);
    }
  }
};

module.exports = connectDB;
