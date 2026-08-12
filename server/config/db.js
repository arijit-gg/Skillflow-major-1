const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smarthire';
    
    // Attempt standard Mongoose connection first
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    
    console.log(`[Database] Connected to MongoDB Host: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Local/Atlas MongoDB connection unavailable (${error.message}). Initializing In-Memory Mongo Database Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] In-Memory MongoDB Server running at: ${mongoUri}`);
    } catch (memErr) {
      console.error(`[Database Critical Error] Failed to initialize database: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
