import type { Timestamp } from './common';

export interface User {
  user_id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  status?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  id?: number|string
}

export interface Role {
  role_id: number | string;
  role_name: string;
  id?:number|string
}

export interface UserRole {
  user_id: number | string;
  role_id: number;
  id?:number|string
}
