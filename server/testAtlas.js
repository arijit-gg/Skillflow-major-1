const connectDB = require('./config/db');

const test = async () => {
  console.log('[Test Atlas DB] Connecting to database...');
  await connectDB();
  console.log('[Test Atlas DB] Done!');
  process.exit(0);
};

test();
