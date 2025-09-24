export type UserRole = 'root' | 'admin' | 'viewer';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}


