interface UserTableCompPaginationProps {
  /**
   * Порядковые номера в общем списке для первой и последней записи на странице
   * @default 0
   */
  paginationStart: number;
  paginationEnd: number;

  /**
   * Всего строк
   * @default 0
   */
  total: number;

  /**
   * Текущая страница
   * @default 0
   */
  currentPage: number;

  /**
   * Всего страниц
   * @default 0
   */
  totalPages: number;

  /**
   * Видимые страницы
   * @default []
   */
  visiblePages: Array<number | '...'>;

  /**
   * Количество строк на странице
   * @default 25
   */
  pageSize: number;
}

interface UserTableCompPaginationEmits {
  /**
   * Переход на страницу с номером page
   */
  (e: 'go-to-page', page: number): void;

  /**
   * Изменение количества записей на странице
   */
  (e: 'update:pageSize', value: number): void;
}

export type { UserTableCompPaginationProps, UserTableCompPaginationEmits };