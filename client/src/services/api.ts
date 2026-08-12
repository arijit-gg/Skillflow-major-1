import axios from 'axios';
import { ApiResponse, User, Job, Applicant, DashboardStats, ApplicantStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api` 
  : '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API error responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on authorization failure if not logging in
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name: string, email: string, password: string, companyName?: string): Promise<ApiResponse<User>> => {
    const res = await API.post('/auth/register', { name, email, password, companyName });
    return res.data;
  },
  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await API.get('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; companyName?: string; avatar?: string }): Promise<ApiResponse<User>> => {
    const res = await API.put('/auth/profile', data);
    return res.data;
  },
};

// Jobs Services
export const jobsAPI = {
  getJobs: async (params?: { search?: string; department?: string; location?: string; jobType?: string; status?: string; page?: number; limit?: number }): Promise<ApiResponse<Job[]>> => {
    const res = await API.get('/jobs', { params });
    return res.data;
  },
  getJobById: async (id: string): Promise<ApiResponse<Job & { applicants: Applicant[] }>> => {
    const res = await API.get(`/jobs/${id}`);
    return res.data;
  },
  createJob: async (jobData: Partial<Job>): Promise<ApiResponse<Job>> => {
    const res = await API.post('/jobs', jobData);
    return res.data;
  },
  updateJob: async (id: string, jobData: Partial<Job>): Promise<ApiResponse<Job>> => {
    const res = await API.put(`/jobs/${id}`, jobData);
    return res.data;
  },
  deleteJob: async (id: string): Promise<ApiResponse<null>> => {
    const res = await API.delete(`/jobs/${id}`);
    return res.data;
  },
};

// Applicants Services
export const applicantsAPI = {
  getApplicants: async (params?: { search?: string; jobId?: string; status?: string; page?: number; limit?: number; sort?: string }): Promise<ApiResponse<Applicant[]>> => {
    const res = await API.get('/applicants', { params });
    return res.data;
  },
  getApplicantById: async (id: string): Promise<ApiResponse<Applicant>> => {
    const res = await API.get(`/applicants/${id}`);
    return res.data;
  },
  addApplicant: async (formData: FormData): Promise<ApiResponse<Applicant>> => {
    const res = await API.post('/applicants', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  updateStatus: async (id: string, status: ApplicantStatus, sendEmail: boolean = true): Promise<ApiResponse<Applicant>> => {
    const res = await API.patch(`/applicants/${id}/status`, { status, sendEmail });
    return res.data;
  },
  updateApplicant: async (id: string, data: Partial<Applicant>): Promise<ApiResponse<Applicant>> => {
    const res = await API.put(`/applicants/${id}`, data);
    return res.data;
  },
  deleteApplicant: async (id: string): Promise<ApiResponse<null>> => {
    const res = await API.delete(`/applicants/${id}`);
    return res.data;
  },
  exportCSV: async (params?: { jobId?: string; status?: string }): Promise<Blob> => {
    const res = await API.get('/applicants/export/csv', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },
};

// Analytics Services
export const analyticsAPI = {
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const res = await API.get('/analytics/dashboard');
    return res.data;
  },
};

export default API;
