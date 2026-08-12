const Job = require('../models/Job');
const Applicant = require('../models/Applicant');

// @desc    Get dashboard analytics metrics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const closedJobs = await Job.countDocuments({ status: 'Closed' });
    const draftJobs = await Job.countDocuments({ status: 'Draft' });

    const totalApplicants = await Applicant.countDocuments();
    const hiredApplicants = await Applicant.countDocuments({ status: 'Hired' });
    const interviewingApplicants = await Applicant.countDocuments({ status: 'Interviewing' });
    const offeredApplicants = await Applicant.countDocuments({ status: 'Offered' });

    // Stage breakdown
    const stages = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'];
    const statusBreakdown = {};

    for (const stage of stages) {
      statusBreakdown[stage] = await Applicant.countDocuments({ status: stage });
    }

    // Department breakdown
    const jobs = await Job.find();
    const departmentMap = {};

    for (const job of jobs) {
      const dept = job.department || 'Other';
      const count = await Applicant.countDocuments({ job: job._id });
      departmentMap[dept] = (departmentMap[dept] || 0) + count;
    }

    const departmentBreakdown = Object.keys(departmentMap).map((dept) => ({
      name: dept,
      applicantCount: departmentMap[dept],
    }));

    // Recent 5 applicants
    const recentApplicants = await Applicant.find()
      .populate('job', 'title department')
      .sort('-appliedDate')
      .limit(5);

    // Recent active jobs
    const recentJobs = await Job.find({ status: 'Active' })
      .sort('-createdAt')
      .limit(4);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalJobs,
          activeJobs,
          closedJobs,
          draftJobs,
          totalApplicants,
          interviewingApplicants,
          offeredApplicants,
          hiredApplicants,
          conversionRate: totalApplicants > 0 ? ((hiredApplicants / totalApplicants) * 100).toFixed(1) : '0',
        },
        statusBreakdown,
        departmentBreakdown,
        recentApplicants,
        recentJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};
