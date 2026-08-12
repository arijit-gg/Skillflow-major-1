const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const seedData = require('./utils/seedData');

// Route imports
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Security and CORS middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded PDF resumes statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Healthcheck Route (Immediate response)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'SmartHire ATS API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.status(200).send('SmartHire ATS API Server is Live!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/analytics', analyticsRoutes);

// Centralized error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SmartHire ATS Backend Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Test Credentials: recruiter@smarthire.com / SmartHire2026!`);
  console.log(`======================================================\n`);

  try {
    await connectDB();
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding test data...');
      await seedData();
    }
  } catch (err) {
    console.warn('[Server] Post-start connect warning:', err.message);
  }
});
