import type { VNodeChild } from 'vue';
import type { EditableUserFields, UserRecord } from '@/types/user.ts';
import type { EditFieldPayload, SortColumn, SortDirection } from '@/types/table.ts';

interface UserTableCompGridProps {
  /**
   * Список пользователей
   * @default []
   */
  users: UserRecord[];

  /**
   * Список выбранных пользователей
   * @default []
   */
  selectedUsers: number[];

  /**
   * Пользователь, редактируемый в моменте
   * @default null
   */
  editingUserId: number | null;

  /**
   * Поля, редактируемые в форме
   */
  editForm: EditableUserFields;

  /**
   * Флаг "Выбраны все"
   * @default false
   */
  isAllSelected: boolean;

  /**
   * Колонка, по которой отсортирован список
   * @defaut 'id'
   */
  sortColumn: SortColumn;

  /**
   * Направление сортировки списка
   * @default 'asc'
   */
  sortDirection: SortDirection;
}

interface UserTableCompGridEmits {
  (e: 'toggle-select-all'): void;
  (e: 'toggle-select', id: number): void;
  (e: 'sort', column: SortColumn): void;
  (e: 'start-edit', user: UserRecord): void;
  (e: 'cancel-edit'): void;
  (e: 'save-edit', id: number): void;
  (e: 'open-details', user: UserRecord): void;
  (e: 'delete-user', id: number): void;
  (e: 'toggle-status', id: number): void;
  (e: 'update-edit-field', payload: EditFieldPayload): void;
}

interface UserTableCompGridSlots {
  'empty-action'?: () => VNodeChild;
}

export type { UserTableCompGridProps, UserTableCompGridEmits, UserTableCompGridSlots };
