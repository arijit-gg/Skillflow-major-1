const Job = require('../models/Job');
const Applicant = require('../models/Applicant');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res, next) => {
  try {
    req.body.recruiter = req.user.id;

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

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs with search, filtering, pagination & sorting
// @route   GET /api/jobs
// @access  Public (or Private)
exports.getJobs = async (req, res, next) => {
  try {
    const { search, department, location, jobType, status, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = {};

    // Search in title, department, or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiter', 'name email companyName avatar')
      .sort(sort)
      .skip(startIndex)
      .limit(limitNum);

    // Attach applicant counts dynamically
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
    next(error);
  }
};

// @desc    Get single job by ID with applicants
// @route   GET /api/jobs/:id
// @access  Public / Private
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email companyName avatar');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
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
    next(error);
  }
};

// @desc    Update job listing
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    // Ensure user owns job or is admin
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job listing.',
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
    next(error);
  }
};

// @desc    Delete job listing and its applicants
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job listing.',
      });
    }

    await Applicant.deleteMany({ job: req.params.id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applicants deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
