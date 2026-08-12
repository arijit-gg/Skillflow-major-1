const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.MONGODB_URI) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Connected to MongoDB Atlas/External Host: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[Database] MongoDB URI connection failed (${err.message}). Trying in-memory server...`);
    }
  }

  // Attempt MongoMemoryServer for local development
  try {
    const connStr = 'mongodb://127.0.0.1:27017/smarthire';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to Local MongoDB: ${conn.connection.host}`);
    return;
  } catch (localErr) {
    console.warn(`[Database] Local MongoDB unavailable. Initializing MongoMemoryServer...`);
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log(`[Database] In-Memory MongoDB Server running at: ${mongoUri}`);
  } catch (memErr) {
    console.warn(`[Database Warning] MongoMemoryServer unavailable in production container (${memErr.message}). App running in cloud mode.`);
  }
};

module.exports = connectDB;
