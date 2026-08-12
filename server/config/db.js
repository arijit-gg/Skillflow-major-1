const mongoose = require('mongoose');

// Disable command buffering so Mongoose throws immediately rather than hanging for 10 seconds if disconnected
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Connected to MongoDB Atlas: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] MongoDB Atlas connection failed: ${err.message}`);
    }
  }

  // Attempt local MongoDB
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/smarthire', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to Local Mongo: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.warn(`[Database] Local Mongo unavailable.`);
  }

  // Attempt MongoMemoryServer
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Re-enable buffering for in-memory server
    mongoose.set('bufferCommands', true);
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] In-Memory MongoDB Server running at: ${mongoUri}`);
    return conn;
  } catch (memErr) {
    console.warn(`[Database Warning] MongoMemoryServer unavailable (${memErr.message}).`);
  }
};

module.exports = connectDB;
