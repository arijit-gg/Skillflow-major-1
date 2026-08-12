const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const { sendCandidateEmail } = require('../services/emailService');
const { Parser } = require('json2csv');

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

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Associated job listing not found.',
      });
    }

    let resumeUrl = req.body.resumeUrl;
    let resumeOriginalName = 'resume.pdf';

    if (req.file) {
      // PDF file uploaded via Multer
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
      resumeOriginalName = req.file.originalname;
    } else if (!resumeUrl) {
      // Fallback resume path if test submission without file upload
      resumeUrl = `/uploads/resumes/sample-resume.pdf`;
    }

    const applicant = await Applicant.create({
      job: jobId,
      recruiter: job.recruiter,
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
    next(error);
  }
};

// @desc    Get applicants with search, stage filter, sorting & pagination
// @route   GET /api/applicants
// @access  Private
exports.getApplicants = async (req, res, next) => {
  try {
    const { search, jobId, status, sort = '-appliedDate', page = 1, limit = 20 } = req.query;

    const query = {};

    if (jobId && jobId !== 'All') {
      query.job = jobId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    const total = await Applicant.countDocuments(query);
    const applicants = await Applicant.find(query)
      .populate('job', 'title department location status')
      .sort(sort)
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
    next(error);
  }
};

// @desc    Get single applicant by ID
// @route   GET /api/applicants/:id
// @access  Private
exports.getApplicantById = async (req, res, next) => {
  try {
    const applicant = await Applicant.findById(req.params.id).populate('job', 'title department location salaryRange status recruiter');

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: applicant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update applicant status stage & send email notification
// @route   PATCH /api/applicants/:id/status
// @access  Private
exports.updateApplicantStatus = async (req, res, next) => {
  try {
    const { status, sendEmail } = req.body;

    const validStatuses = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Rejected', 'Hired'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const applicant = await Applicant.findById(req.params.id).populate('job', 'title department recruiter');

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found.',
      });
    }

    applicant.status = status;
    await applicant.save();

    // Trigger candidate email notification if requested (or default true on key stage changes)
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
      emailNotified: emailResult ? emailResult.success : false,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update applicant rating or notes
// @route   PUT /api/applicants/:id
// @access  Private
exports.updateApplicant = async (req, res, next) => {
  try {
    const { rating, notes, fullName, email, phone } = req.body;

    const fieldsToUpdate = {};
    if (rating !== undefined) fieldsToUpdate.rating = rating;
    if (notes !== undefined) fieldsToUpdate.notes = notes;
    if (fullName) fieldsToUpdate.fullName = fullName;
    if (email) fieldsToUpdate.email = email;
    if (phone) fieldsToUpdate.phone = phone;

    const applicant = await Applicant.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate('job', 'title department');

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: applicant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete applicant
// @route   DELETE /api/applicants/:id
// @access  Private
exports.deleteApplicant = async (req, res, next) => {
  try {
    const applicant = await Applicant.findById(req.params.id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant record not found.',
      });
    }

    await applicant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Applicant record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export applicants data as CSV
// @route   GET /api/applicants/export/csv
// @access  Private
exports.exportApplicantsCSV = async (req, res, next) => {
  try {
    const { jobId, status } = req.query;
    const query = {};

    if (jobId && jobId !== 'All') query.job = jobId;
    if (status && status !== 'All') query.status = status;

    const applicants = await Applicant.find(query).populate('job', 'title department location');

    const fields = [
      { label: 'Applicant ID', value: '_id' },
      { label: 'Full Name', value: 'fullName' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Job Title', value: (row) => (row.job ? row.job.title : 'N/A') },
      { label: 'Department', value: (row) => (row.job ? row.job.department : 'N/A') },
      { label: 'Status Stage', value: 'status' },
      { label: 'Rating (1-5)', value: 'rating' },
      { label: 'Applied Date', value: (row) => new Date(row.appliedDate).toLocaleDateString() },
      { label: 'Resume Link', value: 'resumeUrl' },
      { label: 'Notes', value: 'notes' },
    ];

    let csv = '';
    try {
      const json2csvParser = new Parser({ fields });
      csv = json2csvParser.parse(applicants);
    } catch (parseErr) {
      // Fallback manual CSV formatter
      const headers = fields.map((f) => `"${f.label}"`).join(',');
      const rows = applicants.map((app) => {
        return [
          `"${app._id}"`,
          `"${app.fullName}"`,
          `"${app.email}"`,
          `"${app.phone}"`,
          `"${app.job ? app.job.title : 'N/A'}"`,
          `"${app.job ? app.job.department : 'N/A'}"`,
          `"${app.status}"`,
          `"${app.rating}"`,
          `"${new Date(app.appliedDate).toLocaleDateString()}"`,
          `"${app.resumeUrl}"`,
          `"${(app.notes || '').replace(/"/g, '""')}"`,
        ].join(',');
      });
      csv = [headers, ...rows].join('\n');
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=SmartHire_Applicants_${Date.now()}.csv`);
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
