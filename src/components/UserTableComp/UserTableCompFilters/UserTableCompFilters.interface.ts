import type { UserStatus } from '@/types/user.ts';

interface UserTableCompFiltersProps {
  /**
   * Фильтр по статусу пользователя
   * @default ''
   */
  filterStatus: UserStatus | ''
  /**
   * Фильтры по дате регистрации
   * default ''
   */
  dateFrom: string
  dateTo: string
}

interface UserTableCompFiltersEmits {
  /**
   * Обновление фильтра по статусу пользователя
   */
  (e: 'update:filterStatus', value: UserStatus | ''): void;

  /**
   * Обновление фильтров по дате регистрации
   */
  (e: 'update:dateFrom', value: string): void;
  (e: 'update:dateTo', value: string): void;

  /**
   * Сброс фильтров по дате
   */
  (e: 'clear-dates'): void;
}

export type { UserTableCompFiltersProps, UserTableCompFiltersEmits };
