export interface Application {
  id: string;
  user: number;
  job: string;
  job_title?: string;
  company_name?: string;
  full_name: string;
  email: string;
  phone: string;
  current_location: string;
  preferred_location?: string;
  qualification: string;
  experience: string;
  current_company?: string;
  expected_salary?: string;
  notice_period?: string;
  cv_file: string;
  additional_notes?: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected' | 'Hired';
  created_at: string;
}
