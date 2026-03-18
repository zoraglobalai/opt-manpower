export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'candidate' | 'employer' | 'admin';
}

export interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
}
