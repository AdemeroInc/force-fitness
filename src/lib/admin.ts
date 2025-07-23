import { User } from 'firebase/auth';

export function isAdmin(user: User | null): boolean {
  if (!user?.email) return false;
  return user.email.endsWith('@ademero.com');
}

export function requireAdmin(user: User | null): void {
  if (!isAdmin(user)) {
    throw new Error('Unauthorized: Admin access required');
  }
}