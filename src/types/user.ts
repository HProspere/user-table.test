export type UserRole = 'admin' | 'user' | 'moderator';

export type ValueWithTitle<T> = {
  title: string;
  value: T | '';
}

export type UserStatus = 'active' | 'inactive';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  registrationDate: string;
  lastActivity: string;
  avatar: string | null;
  loginCount: number;
  postsCount: number;
  commentsCount: number;
}

export interface EditableUserFields {
  name: string;
  email: string;
  role: UserRole;
}

export interface NewUserForm extends EditableUserFields {
  sendWelcomeEmail: boolean;
}

export interface NewUserErrors {
  name: string;
  email: string;
}
