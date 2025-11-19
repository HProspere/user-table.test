import type { NewUserErrors, NewUserForm } from '@/types/user.ts';

interface AddUserModalProps {
  visible: boolean;
  newUser: NewUserForm;
  errors: NewUserErrors;
  isSaving: boolean;
  isValid: boolean;
}

interface AddUserModalEmits {
  (e: 'close'): void;
  (e: 'submit'): void;
  (e: 'update-field', payload: { field: keyof NewUserForm; value: string | boolean }): void;
  (e: 'validate-name'): void;
  (e: 'validate-email'): void;
}

export type { AddUserModalProps, AddUserModalEmits };
