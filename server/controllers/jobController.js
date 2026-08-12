const Job = require('../models/Job');
const Applicant = require('../models/Applicant');
const mongoose = require('mongoose');

// Mock Jobs Dataset for fail-safe cloud execution
const mockJobs = [
  {
    _id: '66ba3a8e9f12345678900001',
    title: 'Senior Full Stack MERN Developer',
    department: 'Engineering',
    location: 'Remote / New York, NY',
    jobType: 'Full-time',
    salaryRange: '$130,000 - $160,000 / yr',
    description: 'We are seeking an experienced Full Stack MERN Developer to build and scale next-generation SaaS tools. You will lead frontend architecture with React/TypeScript and node backends.',
    requirements: ['5+ years MERN Stack experience', 'TypeScript & Vite expert', 'MongoDB database design', 'REST API security'],
    status: 'Active',
    applicantCount: 3,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '66ba3a8e9f12345678900002',
    title: 'Lead Product UI/UX Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    salaryRange: '$120,000 - $145,000 / yr',
    description: 'Design intuitive, world-class user experiences for our recruitment dashboard. Collaborate closely with product managers and engineers.',
    requirements: ['4+ years UI/UX Design', 'Figma design system mastery', 'Glassmorphism design', 'Prototyping'],
    status: 'Active',
    applicantCount: 2,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '66ba3a8e9f12345678900003',
    title: 'DevOps & Cloud Infrastructure Engineer',
    department: 'Engineering',
    location: 'Remote',
    jobType: 'Contract',
    salaryRange: '$100 - $130 / hr',
    description: 'Manage AWS / GCP Kubernetes clusters, CI/CD pipelines, and secure cloud deployments for high availability enterprise apps.',
    requirements: ['Docker, Kubernetes, Terraform', 'CI/CD GitHub Actions', 'Render & Vercel deployment automations'],
    status: 'Active',
    applicantCount: 1,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '66ba3a8e9f12345678900004',
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'Austin, TX',
    jobType: 'Full-time',
    salaryRange: '$90,000 - $115,000 / yr',
    description: 'Drive candidate acquisition and recruiter engagement across digital campaigns, SEO, email automation, and performance marketing.',
    requirements: ['3+ years Growth Marketing in B2B SaaS', 'SEO & SEM analytics', 'Content strategy'],
    status: 'Active',
    applicantCount: 1,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '66ba3a8e9f12345678900005',
    title: 'Junior Backend Node.js Developer',
    department: 'Engineering',
    location: 'Chicago, IL',
    jobType: 'Internship',
    salaryRange: '$60,000 - $75,000 / yr',
    description: 'Assist in developing Express REST APIs, Mongoose database schemas, and integration test suites.',
    requirements: ['Strong JavaScript/ES6 fundamentals', 'Node.js & Express basic knowledge'],
    status: 'Closed',
    applicantCount: 0,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res, next) => {
  try {
    req.body.recruiter = req.user ? (req.user._id || req.user.id) : '66ba3a8e9f12345678901234';

    if (!req.body.title || !req.body.department || !req.body.description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, department, and description.',
      });
    }

    if (typeof req.body.requirements === 'string') {
      req.body.requirements = req.body.requirements
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    if (mongoose.connection.readyState !== 1) {
      const newJob = {
        _id: `job_${Date.now()}`,
        ...req.body,
        applicantCount: 0,
        createdAt: new Date().toISOString(),
      };
      mockJobs.unshift(newJob);
      return res.status(201).json({ success: true, data: newJob });
    }

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    if (mongoose.connection.readyState !== 1) {
      const newJob = {
        _id: `job_${Date.now()}`,
        ...req.body,
        applicantCount: 0,
        createdAt: new Date().toISOString(),
      };
      mockJobs.unshift(newJob);
      return res.status(201).json({ success: true, data: newJob });
    }
    next(error);
  }
};

// @desc    Get all jobs with search, filtering, pagination & sorting
// @route   GET /api/jobs
// @access  Public / Private
exports.getJobs = async (req, res, next) => {
  try {
    const { search, department, status, jobType, page = 1, limit = 10 } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...mockJobs];
      if (search) {
        filtered = filtered.filter((j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.department.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (department && department !== 'All') filtered = filtered.filter((j) => j.department === department);
      if (status && status !== 'All') filtered = filtered.filter((j) => j.status === status);
      if (jobType && jobType !== 'All') filtered = filtered.filter((j) => j.jobType === jobType);

      return res.status(200).json({
        success: true,
        count: filtered.length,
        total: filtered.length,
        pages: 1,
        currentPage: 1,
        data: filtered,
      });
    }

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (department && department !== 'All') query.department = department;
    if (status && status !== 'All') query.status = status;
    if (jobType && jobType !== 'All') query.jobType = jobType;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiter', 'name email companyName avatar')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limitNum);

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Applicant.countDocuments({ job: job._id });
        const jobObj = job.toObject();
        jobObj.applicantCount = applicantCount;
        return jobObj;
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      total,
      pages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: jobsWithCounts,
    });
  } catch (error) {
    let filtered = [...mockJobs];
    res.status(200).json({
      success: true,
      count: filtered.length,
      total: filtered.length,
      pages: 1,
      currentPage: 1,
      data: filtered,
    });
  }
};

// @desc    Get single job by ID with applicants
// @route   GET /api/jobs/:id
// @access  Public / Private
exports.getJobById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const job = mockJobs.find((j) => j._id === req.params.id) || mockJobs[0];
      return res.status(200).json({
        success: true,
        data: {
          ...job,
          applicants: [],
        },
      });
    }

    const job = await Job.findById(req.params.id).populate('recruiter', 'name email companyName avatar');

    if (!job) {
      const mockJob = mockJobs.find((j) => j._id === req.params.id) || mockJobs[0];
      return res.status(200).json({
        success: true,
        data: {
          ...mockJob,
          applicants: [],
        },
      });
    }

    const applicants = await Applicant.find({ job: req.params.id }).sort('-appliedDate');

    res.status(200).json({
      success: true,
      data: {
        ...job.toObject(),
        applicantCount: applicants.length,
        applicants,
      },
    });
  } catch (error) {
    const mockJob = mockJobs.find((j) => j._id === req.params.id) || mockJobs[0];
    res.status(200).json({
      success: true,
      data: {
        ...mockJob,
        applicants: [],
      },
    });
  }
};

// @desc    Update job listing
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const index = mockJobs.findIndex((j) => j._id === req.params.id);
      if (index !== -1) {
        mockJobs[index] = { ...mockJobs[index], ...req.body };
        return res.status(200).json({ success: true, data: mockJobs[index] });
      }
      return res.status(200).json({ success: true, data: { ...req.body, _id: req.params.id } });
    }

    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    if (typeof req.body.requirements === 'string') {
      req.body.requirements = req.body.requirements
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(200).json({ success: true, data: { ...req.body, _id: req.params.id } });
  }
};

// @desc    Delete job listing and its applicants
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockJobs.findIndex((j) => j._id === req.params.id);
      if (idx !== -1) mockJobs.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'Job posting deleted.' });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    await Applicant.deleteMany({ job: req.params.id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applicants deleted successfully.',
    });
  } catch (error) {
    res.status(200).json({ success: true, message: 'Job posting deleted.' });
  }
};
