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
  crossOriginResourcePolicy: false, // Allow serving resumes across origins
}));
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded PDF resumes statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Healthcheck Route (Immediate response for Render health checks)
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

// Listen immediately so Render web service healthcheck passes in < 1 second!
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SmartHire ATS Backend Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Test Credentials: recruiter@smarthire.com / SmartHire2026!`);
  console.log(`======================================================\n`);

  // Connect database in background
  connectDB().then(async () => {
    try {
      const User = require('./models/User');
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Server] Database is empty. Running automatic seed data...');
        await seedData();
      }
    } catch (err) {
      console.warn('[Server] Post-DB connect seed check:', err.message);
    }
  });
});
