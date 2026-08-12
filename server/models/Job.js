const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add job title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    department: {
      type: String,
      required: [true, 'Please select department'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add location (e.g., Remote, New York, NY)'],
      trim: true,
    },
    jobType: {
      type: String,
      required: [true, 'Please select job type'],
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
      default: 'Full-time',
    },
    salaryRange: {
      type: String,
      default: '$80,000 - $120,000 / year',
    },
    description: {
      type: String,
      required: [true, 'Please add job description'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
    },
    recruiter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for getting total applicants for a job
JobSchema.virtual('applicants', {
  ref: 'Applicant',
  localField: '_id',
  foreignField: 'job',
  justOne: false,
});

module.exports = mongoose.model('Job', JobSchema);
