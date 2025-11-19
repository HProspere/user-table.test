import type { UserRecord } from '@/types/user.ts';

interface UserDetailsModalProps {
  visible: boolean;
  user: UserRecord | null;
}

interface UserDetailsModalEmits {
  (e: 'close'): void;
}

export type { UserDetailsModalProps, UserDetailsModalEmits };
