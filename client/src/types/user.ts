import type { Timestamp } from './common';

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  status?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  id: string;
  bus_company_id?: string;
}

export interface Role {
  role_name: string;
  id: string
}

export interface UserRole {
  user_id: string;
  role_id: string;
  id?: number | string
}
