import type { EditableUserFields } from '@/types/user.ts';

type SortColumn =
  | 'id'
  | 'name'
  | 'email'
  | 'registrationDate'
  | 'lastActivity';

type SortDirection = 'asc' | 'desc';

type EditFieldPayload = {
  field: keyof EditableUserFields;
  value: EditableUserFields[keyof EditableUserFields];
};

export type { SortColumn, SortDirection, EditFieldPayload };
