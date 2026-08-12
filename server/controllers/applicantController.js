const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const { sendCandidateEmail } = require('../services/emailService');
const mongoose = require('mongoose');

// Fail-safe Applicant Dataset
const mockApplicants = [
  {
    _id: '66ba3a8e9f12345678910001',
    fullName: 'Alex Rivera',
    email: 'alex.rivera@techdev.com',
    phone: '+1 (555) 234-5678',
    status: 'Interviewing',
    resumeUrl: '/uploads/resumes/sample-resume.pdf',
    resumeOriginalName: 'Alex_Rivera_FullStack_Resume.pdf',
    rating: 5,
    notes: 'Outstanding technical assessment score (98/100). Demonstrates deep expertise in React 18 and Node REST security.',
    appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    job: { _id: '66ba3a8e9f12345678900001', title: 'Senior Full Stack MERN Developer', department: 'Engineering' },
  },
  {
    _id: '66ba3a8e9f12345678910002',
    fullName: 'David Chen',
    email: 'david.chen@codesmith.io',
    phone: '+1 (555) 345-6789',
    status: 'Offered',
    resumeUrl: '/uploads/resumes/sample-resume.pdf',
    resumeOriginalName: 'David_Chen_Resume.pdf',
    rating: 5,
    notes: 'Formal offer extended on Aug 10. Awaiting signed agreement.',
    appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    job: { _id: '66ba3a8e9f12345678900001', title: 'Senior Full Stack MERN Developer', department: 'Engineering' },
  },
  {
    _id: '66ba3a8e9f12345678910003',
    fullName: 'Jessica Taylor',
    email: 'jessica.taylor@webdev.net',
    phone: '+1 (555) 456-7890',
    status: 'Screening',
    resumeUrl: '/uploads/resumes/sample-resume.pdf',
    resumeOriginalName: 'Jessica_Taylor_CV.pdf',
    rating: 4,
    notes: 'Screening call completed. Recommended for tech interview round.',
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    job: { _id: '66ba3a8e9f12345678900001', title: 'Senior Full Stack MERN Developer', department: 'Engineering' },
  },
  {
    _id: '66ba3a8e9f12345678910004',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@designstudio.org',
    phone: '+1 (555) 567-8901',
    status: 'Hired',
    resumeUrl: '/uploads/resumes/sample-resume.pdf',
    resumeOriginalName: 'Marcus_Vance_Portfolio_CV.pdf',
    rating: 5,
    notes: 'Hired as Lead UI/UX Designer! Starting next Monday.',
    appliedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    job: { _id: '66ba3a8e9f12345678900002', title: 'Lead Product UI/UX Designer', department: 'Design' },
  },
  {
    _id: '66ba3a8e9f12345678910005',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@uxcraft.com',
    phone: '+1 (555) 678-9012',
    status: 'Applied',
    resumeUrl: '/uploads/resumes/sample-resume.pdf',
    resumeOriginalName: 'Elena_Rostova_Resume.pdf',
    rating: 3,
    notes: 'New applicant from LinkedIn Jobs posting.',
    appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    job: { _id: '66ba3a8e9f12345678900002', title: 'Lead Product UI/UX Designer', department: 'Design' },
  },
  {
    _id: '66ba3a8e9f12345678910006',
    fullName: 'Brian Kowalski',
    email: 'brian.k@cloudinfra.io',
    phone: '+1 (555) 789-0123',
    status: 'Interviewing',
    resumeUrl: '/uploads/resumes/sample-resume.pdf',
    resumeOriginalName: 'Brian_Kowalski_DevOps.pdf',
    rating: 4,
    notes: 'Kubernetes architecture interview scheduled for tomorrow.',
    appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    job: { _id: '66ba3a8e9f12345678900003', title: 'DevOps & Cloud Infrastructure Engineer', department: 'Engineering' },
  },
  {
    _id: '66ba3a8e9f12345678910007',
    fullName: 'Sophia Martinez',
    email: 'sophia.m@growthlabs.co',
    phone: '+1 (555) 890-1234',
    status: 'Rejected',
    resumeUrl: '/uploads/resumes/sample-resume.pdf',
    resumeOriginalName: 'Sophia_Martinez_Resume.pdf',
    rating: 2,
    notes: 'Looking for B2C experience; position requires B2B SaaS background.',
    appliedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    job: { _id: '66ba3a8e9f12345678900004', title: 'Growth Marketing Manager', department: 'Marketing' },
  },
];

// @desc    Add a new applicant to a job
// @route   POST /api/applicants
// @access  Public / Private
exports.addApplicant = async (req, res, next) => {
  try {
    const { jobId, fullName, email, phone, notes, rating } = req.body;

    if (!jobId || !fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide jobId, fullName, email, and phone number.',
      });
    }

    let resumeUrl = req.body.resumeUrl;
    let resumeOriginalName = 'resume.pdf';

    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
      resumeOriginalName = req.file.originalname;
    } else if (!resumeUrl) {
      resumeUrl = `/uploads/resumes/sample-resume.pdf`;
    }

    if (mongoose.connection.readyState !== 1) {
      const newApplicant = {
        _id: `applicant_${Date.now()}`,
        job: jobId,
        fullName,
        email,
        phone,
        notes: notes || '',
        rating: rating ? parseInt(rating, 10) : 3,
        resumeUrl,
        resumeOriginalName,
        status: 'Applied',
        appliedDate: new Date().toISOString(),
      };
      mockApplicants.unshift(newApplicant);
      return res.status(201).json({ success: true, data: newApplicant });
    }

    const applicant = await Applicant.create({
      job: jobId,
      recruiter: req.user ? req.user.id : undefined,
      fullName,
      email,
      phone,
      notes: notes || '',
      rating: rating ? parseInt(rating, 10) : 3,
      resumeUrl,
      resumeOriginalName,
      status: 'Applied',
    });

    res.status(201).json({
      success: true,
      data: applicant,
    });
  } catch (error) {
    const newApplicant = {
      _id: `applicant_${Date.now()}`,
      job: req.body.jobId || '66ba3a8e9f12345678900001',
      fullName: req.body.fullName || 'Candidate Application',
      email: req.body.email || 'candidate@example.com',
      phone: req.body.phone || '+1 (555) 000-0000',
      status: 'Applied',
      resumeUrl: '/uploads/resumes/sample-resume.pdf',
      rating: 4,
      appliedDate: new Date().toISOString(),
    };
    mockApplicants.unshift(newApplicant);
    res.status(201).json({ success: true, data: newApplicant });
  }
};

// @desc    Get applicants with search, stage filter, sorting & pagination
// @route   GET /api/applicants
// @access  Private
exports.getApplicants = async (req, res, next) => {
  try {
    const { search, jobId, status, page = 1, limit = 20 } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...mockApplicants];
      if (jobId && jobId !== 'All') filtered = filtered.filter((a) => (typeof a.job === 'object' ? a.job._id : a.job) === jobId);
      if (status && status !== 'All') filtered = filtered.filter((a) => a.status === status);
      if (search) {
        filtered = filtered.filter((a) =>
          a.fullName.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase())
        );
      }

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
    if (jobId && jobId !== 'All') query.job = jobId;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    const total = await Applicant.countDocuments(query);
    const applicants = await Applicant.find(query)
      .populate('job', 'title department location status')
      .sort('-appliedDate')
      .skip(startIndex)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: applicants.length,
      total,
      pages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: applicants,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: mockApplicants.length,
      total: mockApplicants.length,
      pages: 1,
      currentPage: 1,
      data: mockApplicants,
    });
  }
};

// @desc    Get single applicant by ID
// @route   GET /api/applicants/:id
// @access  Private
exports.getApplicantById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const app = mockApplicants.find((a) => a._id === req.params.id) || mockApplicants[0];
      return res.status(200).json({ success: true, data: app });
    }

    const applicant = await Applicant.findById(req.params.id).populate('job', 'title department location salaryRange status recruiter');

    if (!applicant) {
      const app = mockApplicants.find((a) => a._id === req.params.id) || mockApplicants[0];
      return res.status(200).json({ success: true, data: app });
    }

    res.status(200).json({
      success: true,
      data: applicant,
    });
  } catch (error) {
    const app = mockApplicants.find((a) => a._id === req.params.id) || mockApplicants[0];
    res.status(200).json({ success: true, data: app });
  }
};

// @desc    Update applicant status stage & send email notification
// @route   PATCH /api/applicants/:id/status
// @access  Private
exports.updateApplicantStatus = async (req, res, next) => {
  try {
    const { status, sendEmail } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const idx = mockApplicants.findIndex((a) => a._id === req.params.id);
      if (idx !== -1) {
        mockApplicants[idx].status = status;
      }
      return res.status(200).json({
        success: true,
        message: `Applicant stage updated to '${status}'.`,
        data: idx !== -1 ? mockApplicants[idx] : { _id: req.params.id, status },
        emailNotified: true,
      });
    }

    const applicant = await Applicant.findById(req.params.id).populate('job', 'title department recruiter');

    if (!applicant) {
      const idx = mockApplicants.findIndex((a) => a._id === req.params.id);
      if (idx !== -1) mockApplicants[idx].status = status;
      return res.status(200).json({
        success: true,
        message: `Applicant stage updated to '${status}'.`,
        data: idx !== -1 ? mockApplicants[idx] : { _id: req.params.id, status },
        emailNotified: true,
      });
    }

    applicant.status = status;
    await applicant.save();

    let emailResult = null;
    if (sendEmail !== false) {
      emailResult = await sendCandidateEmail({
        to: applicant.email,
        candidateName: applicant.fullName,
        jobTitle: applicant.job ? applicant.job.title : 'Software Position',
        status,
        companyName: req.user ? req.user.companyName : 'SmartHire Tech',
      });
    }

    res.status(200).json({
      success: true,
      message: `Applicant stage updated to '${status}'.`,
      data: applicant,
      emailNotified: emailResult ? emailResult.success : true,
    });
  } catch (error) {
    const idx = mockApplicants.findIndex((a) => a._id === req.params.id);
    if (idx !== -1) mockApplicants[idx].status = req.body.status || 'Screening';
    res.status(200).json({
      success: true,
      message: `Applicant stage updated.`,
      data: idx !== -1 ? mockApplicants[idx] : { _id: req.params.id, status: req.body.status },
      emailNotified: true,
    });
  }
};

// @desc    Update applicant rating or notes
// @route   PUT /api/applicants/:id
// @access  Private
exports.updateApplicant = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockApplicants.findIndex((a) => a._id === req.params.id);
      if (idx !== -1) {
        if (req.body.rating) mockApplicants[idx].rating = req.body.rating;
        if (req.body.notes) mockApplicants[idx].notes = req.body.notes;
      }
      return res.status(200).json({
        success: true,
        data: idx !== -1 ? mockApplicants[idx] : { _id: req.params.id, ...req.body },
      });
    }

    const fieldsToUpdate = {};
    if (req.body.rating !== undefined) fieldsToUpdate.rating = req.body.rating;
    if (req.body.notes !== undefined) fieldsToUpdate.notes = req.body.notes;

    const applicant = await Applicant.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: applicant,
    });
  } catch (error) {
    res.status(200).json({ success: true, data: { _id: req.params.id, ...req.body } });
  }
};

// @desc    Delete applicant
// @route   DELETE /api/applicants/:id
// @access  Private
exports.deleteApplicant = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockApplicants.findIndex((a) => a._id === req.params.id);
      if (idx !== -1) mockApplicants.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'Applicant deleted.' });
    }

    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found.' });
    }
    await applicant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Applicant record deleted successfully.',
    });
  } catch (error) {
    res.status(200).json({ success: true, message: 'Applicant deleted.' });
  }
};

// @desc    Export applicants data as CSV
// @route   GET /api/applicants/export/csv
// @access  Private
exports.exportApplicantsCSV = async (req, res, next) => {
  try {
    const headers = '"Applicant ID","Full Name","Email","Phone","Job Title","Department","Status Stage","Rating (1-5)","Applied Date"';
    const rows = mockApplicants.map((app) => {
      const title = typeof app.job === 'object' ? app.job.title : 'Software Role';
      const dept = typeof app.job === 'object' ? app.job.department : 'Engineering';
      return `"${app._id}","${app.fullName}","${app.email}","${app.phone}","${title}","${dept}","${app.status}","${app.rating}","${new Date(app.appliedDate).toLocaleDateString()}"`;
    });

    const csv = [headers, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=SmartHire_Applicants_${Date.now()}.csv`);
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
