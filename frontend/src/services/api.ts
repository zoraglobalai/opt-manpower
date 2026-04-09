import axios from 'axios';

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  '/api'
).replace(/\/+$/, '');

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, try to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });
          localStorage.setItem('access_token', res.data.access);
          if (res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh);
          error.config.headers.Authorization = `Bearer ${res.data.access}`;
          return api.request(error.config);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: any) => api.post('/register/', data),
  login: (data: any) => api.post('/login/', data),
  me: () => api.get('/me/'),
  updateMe: (data: any) => api.patch('/me/', data),
};

// ── Candidate ─────────────────────────────────────────────────────────────────
export const candidateAPI = {
  dashboard: () => api.get('/candidate/dashboard/'),
  getProfile: () => api.get('/candidate/profile/'),
  updateProfile: (data: FormData) =>
    api.patch('/candidate/profile/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  myApplications: () => api.get('/my-applications/'),
  savedJobs: () => api.get('/saved-jobs/'),
  saveJob: (jobId: string) => api.post(`/save-job/${jobId}/`),
  apply: (data: FormData) =>
    api.post('/apply-job/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ── Recruiter ─────────────────────────────────────────────────────────────────
export const recruiterAPI = {
  getProfile: () => api.get('/recruiter/profile/'),
  updateProfile: (data: any) => api.patch('/recruiter/profile/', data),
  getDashboard: () => api.get('/recruiter/dashboard/'),
  createJob: (data: any) => api.post('/recruiter/jobs/create/', data),
  updateJob: (id: string, data: any) => api.patch(`/recruiter/jobs/${id}/`, data),
  deleteJob: (id: string) => api.delete(`/recruiter/jobs/${id}/`),
  getJobApplicants: (jobId: string) => api.get(`/recruiter/jobs/${jobId}/applicants/`),
  // Forwarded candidates
  getCandidates: () => api.get('/recruiter/candidates/'),
  updateCandidateStatus: (id: string, status: string) => api.patch(`/recruiter/candidates/${id}/status/`, { status }),
};

// ── Jobs ──────────────────────────────────────────────────────────────────────
export const jobsAPI = {
  list: (params?: object) => api.get('/jobs/', { params }),
  detail: (id: string) => api.get(`/jobs/${id}/`),
};

// ── Content ───────────────────────────────────────────────────────────────────
export const contentAPI = {
  testimonials: () => api.get('/testimonials/'),
  careerAdvice: () => api.get('/career-advice/'),
  careerAdviceDetail: (id: number) => api.get(`/career-advice/${id}/`),
  employerEnquiry: (data: object) => api.post('/enquiries/', data),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/dashboard/'),
  getAnalytics: () => api.get('/admin/analytics/'),
  getJobs: () => api.get('/admin/jobs/'),
  createJob: (data: any) => api.post('/admin/jobs/create/', data),
  updateJob: (id: string, data: any) => api.patch(`/admin/jobs/${id}/`, data),
  deleteJob: (id: string) => api.delete(`/admin/jobs/${id}/`),
  getApplications: (params?: any) => api.get('/admin/applications/', { params }),
  updateApplicationStatus: (id: string, status: string) => api.patch(`/admin/applications/${id}/status/`, { status }),
  getEnquiries: () => api.get('/admin/enquiries/'),
  getCandidates: (params?: any) => api.get('/admin/candidates/', { params }),
  
  // Employer Management & Forwarding
  getEmployers: () => api.get('/admin/employers/'),
  updateEmployer: (id: number, data: any) => api.patch(`/admin/employers/${id}/`, data),
  forwardCandidate: (application_id: string, recruiter_id: number, notes: string) => 
    api.post('/admin/forward-candidate/', { application_id, recruiter_id, notes }),
};

// Backward-compat alias
export const applicationsAPI = candidateAPI;

export default api;
