const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Job = require('../models/Job');
const Applicant = require('../models/Applicant');
const connectDB = require('../config/db');

// Sample dummy resume creation
const createSampleResumeFile = () => {
  const uploadDir = path.join(__dirname, '../uploads/resumes');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const samplePdfPath = path.join(uploadDir, 'sample-resume.pdf');
  if (!fs.existsSync(samplePdfPath)) {
    // Write a dummy valid PDF file content
    const dummyPdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 55 >>
stream
BT /F1 24 Tf 100 700 TD (SmartHire Candidate Resume) ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
312
%%EOF`;
    fs.writeFileSync(samplePdfPath, dummyPdfContent);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    createSampleResumeFile();

    console.log('[Seeding] Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Applicant.deleteMany({});

    console.log('[Seeding] Creating Recruiter Test Account...');
    const recruiter = await User.create({
      name: 'Sarah Connor (Test Recruiter)',
      email: 'recruiter@smarthire.com',
      password: 'SmartHire2026!',
      role: 'recruiter',
      companyName: 'SmartHire Global Inc.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    });

    console.log('[Seeding] Creating Initial Job Listings...');
    const jobs = await Job.create([
      {
        title: 'Senior Full Stack MERN Developer',
        department: 'Engineering',
        location: 'Remote / New York, NY',
        jobType: 'Full-time',
        salaryRange: '$130,000 - $160,000 / yr',
        description: 'We are seeking an experienced Full Stack MERN Developer to build and scale next-generation SaaS tools. You will lead frontend architecture with React/TypeScript and node backends.',
        requirements: ['5+ years MERN Stack experience', 'TypeScript & Vite expert', 'MongoDB database design & indexing', 'REST API & GraphQL architecture'],
        status: 'Active',
        recruiter: recruiter._id,
      },
      {
        title: 'Lead Product UI/UX Designer',
        department: 'Design',
        location: 'San Francisco, CA',
        jobType: 'Full-time',
        salaryRange: '$120,000 - $145,000 / yr',
        description: 'Design intuitive, world-class user experiences for our recruitment dashboard. Collaborate closely with product managers and engineers.',
        requirements: ['4+ years UI/UX Design', 'Figma design system mastery', 'Glassmorphism & micro-interactions design', 'User research & prototyping'],
        status: 'Active',
        recruiter: recruiter._id,
      },
      {
        title: 'DevOps & Cloud Infrastructure Engineer',
        department: 'Engineering',
        location: 'Remote',
        jobType: 'Contract',
        salaryRange: '$100 - $130 / hr',
        description: 'Manage AWS / GCP Kubernetes clusters, CI/CD pipelines, and secure cloud deployments for high availability enterprise apps.',
        requirements: ['Docker, Kubernetes, Terraform', 'CI/CD GitHub Actions & Jenkins', 'Render & Vercel deployment automations', 'MongoDB Atlas security monitoring'],
        status: 'Active',
        recruiter: recruiter._id,
      },
      {
        title: 'Growth Marketing Manager',
        department: 'Marketing',
        location: 'Austin, TX',
        jobType: 'Full-time',
        salaryRange: '$90,000 - $115,000 / yr',
        description: 'Drive candidate acquisition and recruiter engagement across digital campaigns, SEO, email automation, and performance marketing.',
        requirements: ['3+ years Growth Marketing in B2B SaaS', 'SEO & SEM analytics', 'Content strategy & A/B testing'],
        status: 'Active',
        recruiter: recruiter._id,
      },
      {
        title: 'Junior Backend Node.js Developer',
        department: 'Engineering',
        location: 'Chicago, IL',
        jobType: 'Internship',
        salaryRange: '$60,000 - $75,000 / yr',
        description: 'Assist in developing Express REST APIs, Mongoose database schemas, and integration test suites.',
        requirements: ['Strong JavaScript/ES6 fundamentals', 'Node.js & Express basic knowledge', 'REST API principles'],
        status: 'Closed',
        recruiter: recruiter._id,
      },
    ]);

    console.log('[Seeding] Creating Applicants Pipeline Data...');
    await Applicant.create([
      {
        job: jobs[0]._id,
        recruiter: recruiter._id,
        fullName: 'Alex Rivera',
        email: 'alex.rivera@techdev.com',
        phone: '+1 (555) 234-5678',
        status: 'Interviewing',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeOriginalName: 'Alex_Rivera_FullStack_Resume.pdf',
        rating: 5,
        notes: 'Outstanding technical assessment score (98/100). Demonstrates deep expertise in React 18 and Node REST security.',
        appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        job: jobs[0]._id,
        recruiter: recruiter._id,
        fullName: 'David Chen',
        email: 'david.chen@codesmith.io',
        phone: '+1 (555) 345-6789',
        status: 'Offered',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeOriginalName: 'David_Chen_Resume.pdf',
        rating: 5,
        notes: 'Formal offer extended on Aug 10. Awaiting signed agreement.',
        appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        job: jobs[0]._id,
        recruiter: recruiter._id,
        fullName: 'Jessica Taylor',
        email: 'jessica.taylor@webdev.net',
        phone: '+1 (555) 456-7890',
        status: 'Screening',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeOriginalName: 'Jessica_Taylor_CV.pdf',
        rating: 4,
        notes: 'Screening call completed. Recommended for tech interview round.',
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        job: jobs[1]._id,
        recruiter: recruiter._id,
        fullName: 'Marcus Vance',
        email: 'marcus.vance@designstudio.org',
        phone: '+1 (555) 567-8901',
        status: 'Hired',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeOriginalName: 'Marcus_Vance_Portfolio_CV.pdf',
        rating: 5,
        notes: 'Hired as Lead UI/UX Designer! Starting next Monday.',
        appliedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        job: jobs[1]._id,
        recruiter: recruiter._id,
        fullName: 'Elena Rostova',
        email: 'elena.rostova@uxcraft.com',
        phone: '+1 (555) 678-9012',
        status: 'Applied',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeOriginalName: 'Elena_Rostova_Resume.pdf',
        rating: 3,
        notes: 'New applicant from LinkedIn Jobs posting.',
        appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        job: jobs[2]._id,
        recruiter: recruiter._id,
        fullName: 'Brian Kowalski',
        email: 'brian.k@cloudinfra.io',
        phone: '+1 (555) 789-0123',
        status: 'Interviewing',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeOriginalName: 'Brian_Kowalski_DevOps.pdf',
        rating: 4,
        notes: 'Kubernetes architecture interview scheduled for tomorrow at 2 PM.',
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        job: jobs[3]._id,
        recruiter: recruiter._id,
        fullName: 'Sophia Martinez',
        email: 'sophia.m@growthlabs.co',
        phone: '+1 (555) 890-1234',
        status: 'Rejected',
        resumeUrl: '/uploads/resumes/sample-resume.pdf',
        resumeOriginalName: 'Sophia_Martinez_Resume.pdf',
        rating: 2,
        notes: 'Looking for B2C experience; position requires B2B SaaS background.',
        appliedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('\n======================================================');
    console.log(' SEED SUCCESSFUL! Test Recruiter Credentials:');
    console.log(' Email:    recruiter@smarthire.com');
    console.log(' Password: SmartHire2026!');
    console.log('======================================================\n');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
