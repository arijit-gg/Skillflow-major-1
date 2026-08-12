export type Role = 'recruiter' | 'admin';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';

export type JobStatus = 'Active' | 'Closed' | 'Draft';

export type ApplicantStatus = 'Applied' | 'Screening' | 'Interviewing' | 'Offered' | 'Rejected' | 'Hired';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  companyName: string;
  avatar: string;
}

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  salaryRange: string;
  description: string;
  requirements: string[];
  status: JobStatus;
  recruiter: User | string;
  applicantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  _id: string;
  job: Job | string;
  recruiter?: User | string;
  fullName: string;
  email: string;
  phone: string;
  status: ApplicantStatus;
  resumeUrl: string;
  resumeOriginalName?: string;
  rating: number;
  notes?: string;
  appliedDate: string;
  createdAt?: string;
}

export interface DashboardSummary {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  draftJobs: number;
  totalApplicants: number;
  interviewingApplicants: number;
  offeredApplicants: number;
  hiredApplicants: number;
  conversionRate: string;
}

export interface DepartmentBreakdown {
  name: string;
  applicantCount: number;
}

export interface DashboardStats {
  summary: DashboardSummary;
  statusBreakdown: Record<ApplicantStatus, number>;
  departmentBreakdown: DepartmentBreakdown[];
  recentApplicants: Applicant[];
  recentJobs: Job[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  total?: number;
  pages?: number;
  currentPage?: number;
  emailNotified?: boolean;
  data: T;
  token?: string;
  user?: User;
}
