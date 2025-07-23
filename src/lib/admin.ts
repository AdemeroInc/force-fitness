import { User } from 'firebase/auth';

const ADMIN_EMAILS = [
  'mmontesino@ademero.com'
];

export function isAdmin(user: User | null): boolean {
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email);
}

export function requireAdmin(user: User | null): void {
  if (!isAdmin(user)) {
    throw new Error('Unauthorized: Admin access required');
  }
}