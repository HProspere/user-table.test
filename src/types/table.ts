type SortColumn =
  | 'id'
  | 'name'
  | 'email'
  | 'registrationDate'
  | 'lastActivity';

type SortDirection = 'asc' | 'desc';

export type { SortColumn, SortDirection };
