export interface Job {
  id: string;
  title: string;
  company_name: string;
  description: string;
  location: string;
  country: string;
  experience: string;
  salary: string;
  job_type: 'Full Time' | 'Part Time' | 'Contract';
  category: string;
  visa_type?: string;
  deadline?: string;
  is_international: boolean;
  requirements?: string;
  benefits?: string;
  status: 'Published' | 'Draft' | 'Closed';
  created_at: string;
}

export interface JobFilters {
  q?: string;
  category?: string;
  job_type?: string;
  country?: string;
  is_international?: boolean;
  page?: number;
}
