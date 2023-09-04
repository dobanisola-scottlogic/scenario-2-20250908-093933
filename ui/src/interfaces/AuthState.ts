import { UserRole } from '../enums/UserRole';

export interface AuthState {
  name: string;
  role: UserRole;
  credentials: string;
}
