const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    recruiter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    fullName: {
      type: String,
      required: [true, 'Please add applicant full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add applicant email'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add contact phone number'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Screening', 'Interviewing', 'Offered', 'Rejected', 'Hired'],
      default: 'Applied',
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume file path or URL is required'],
    },
    resumeOriginalName: {
      type: String,
      default: 'resume.pdf',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    notes: {
      type: String,
      default: '',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Applicant', ApplicantSchema);
