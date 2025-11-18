import type { UserRole } from '@/types/user.ts';

interface UserTableCompHeaderProps {
  /**
   * Заголовок
   * @default ''
   */
  title: string

  /**
   * Всего записей
   * @default 0
   */
  totalCount?: number

  /**
   * Строка поиска
   * @default ''
   */
  searchString?: string

  /**
   * Фильтр по роли пользователя
   * @default ''
   */
  filterRole?: UserRole | ''

  /**
   * Количество выбранных записей
   * @default 0
   */
  selectedCount?: number

  /**
   * Доступность экспорта записей
   * @default false
   */
  canExport?: boolean

  /**
   * Флаг загрузки данных
   * @default false
   */
  isLoading: boolean
}

interface UserTableCompHeaderEmits {
  /**
   *  Изменение строки поиска
   */
  (e: "update:searchString", value: string): void

  /**
   *  Изменение фильтра по роли пользователя
   */
  (e: "update:filterRole", value: "" | UserRole): void

  /**
   *  Нажата кнопка добавления пользователя
   */
  (e: "open-add-user"): void;

  /**
   *  Нажата кнопка экспорта списка пользователей
   */
  (e: "export"): void;

  /**
   *  Нажата кнопка удаления выбранных пользователей
   */
  (e: "delete"): void;
}

export type { UserTableCompHeaderProps, UserTableCompHeaderEmits };
