import { computed, ref, type Ref, watch } from 'vue';
import type { EditableUserFields, UserRecord, UserRole, UserStatus } from '@/types/user.ts';
import type { SortColumn, SortDirection } from '@/types/table.ts';

type PageItem = number | '...';
type SortableFields = Pick<UserRecord, SortColumn>;
type SortableFieldValue = SortableFields[SortColumn];

interface UseUserTableStateArgs {
  users: Ref<UserRecord[]>;
  initialPageSize: number;
}

export function useUserTableCompState({
    users,
    initialPageSize,
  }: UseUserTableStateArgs) {
  const searchQuery = ref('');
  const filterRole = ref<UserRole | ''>('');
  const filterStatus = ref<UserStatus | ''>('');
  const dateFrom = ref('');
  const dateTo = ref('');

  const sortColumn = ref<SortColumn>('id');
  const sortDirection = ref<SortDirection>('asc');

  const currentPage = ref(1);
  const pageSize = ref(initialPageSize);

  const selectedUsers = ref<number[]>([]);

  const editingUserId = ref<number | null>(null);
  const editForm = ref<EditableUserFields>({
    name: '',
    email: '',
    role: 'user',
  });

  const filteredByRole = computed(() => {
    if (!filterRole.value) {
      return users.value;
    }
    return users.value.filter((user) => user.role === filterRole.value);
  });

  const filteredByStatus = computed(() => {
    if (!filterStatus.value) {
      return filteredByRole.value;
    }
    return filteredByRole.value.filter(
      (user) => user.status === filterStatus.value
    );
  });

  const filteredByDate = computed(() => {
    let result = filteredByStatus.value;

    if (dateFrom.value) {
      const from = new Date(dateFrom.value);
      result = result.filter(
        (user) => new Date(user.registrationDate).getTime() >= from.getTime()
      );
    }

    if (dateTo.value) {
      const to = new Date(dateTo.value);
      to.setHours(23, 59, 59, 999);
      result = result.filter(
        (user) => new Date(user.registrationDate).getTime() <= to.getTime()
      );
    }

    return result;
  });

  const filteredAndSearchedUsers = computed(() => {
    if (!searchQuery.value.trim()) {
      return filteredByDate.value;
    }

    const query = searchQuery.value.toLowerCase().trim();
    return filteredByDate.value.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toString().includes(query)
      );
    });
  });

  const sortedUsers = computed(() => {
    const result = [...filteredAndSearchedUsers.value];

    result.sort((a, b) => {
      const column = sortColumn.value;
      let aVal = a[column as keyof SortableFields] as SortableFieldValue;
      let bVal = b[column as keyof SortableFields] as SortableFieldValue;

      if (
        sortColumn.value === 'registrationDate' ||
        sortColumn.value === 'lastActivity'
      ) {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) {
        return sortDirection.value === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortDirection.value === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(sortedUsers.value.length / pageSize.value))
  );

  const paginationStart = computed(
    () => (currentPage.value - 1) * pageSize.value + 1
  );

  const paginationEnd = computed(() => {
    const end = currentPage.value * pageSize.value;
    return end > sortedUsers.value.length
      ? sortedUsers.value.length
      : end;
  });

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedUsers.value.slice(start, end);
  });

  const visiblePages = computed<PageItem[]>(() => {
    const pages: PageItem[] = [];
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= 7) {
      for (let i = 1; i <= total; i += 1) {
        pages.push(i);
      }
    } else if (current <= 4) {
      for (let i = 1; i <= 5; i += 1) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i += 1) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i += 1) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  const isAllSelected = computed(() => {
    return (
      paginatedUsers.value.length > 0 &&
      paginatedUsers.value.every((user) =>
        selectedUsers.value.includes(user.id)
      )
    );
  });

  const sortBy = (column: SortColumn) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = () => {
    currentPage.value = 1;
  };

  const toggleSelectUser = (userId: number) => {
    if (selectedUsers.value.includes(userId)) {
      selectedUsers.value = selectedUsers.value.filter((id) => id !== userId);
    } else {
      selectedUsers.value = [...selectedUsers.value, userId];
    }
  };

  const toggleSelectAll = () => {
    if (isAllSelected.value) {
      const idsToRemove = paginatedUsers.value.map((user) => user.id);
      selectedUsers.value = selectedUsers.value.filter(
        (id) => !idsToRemove.includes(id)
      );
    } else {
      const idsToAdd = paginatedUsers.value
        .map((user) => user.id)
        .filter((id) => !selectedUsers.value.includes(id));
      selectedUsers.value = [...selectedUsers.value, ...idsToAdd];
    }
  };

  const startEdit = (user: UserRecord) => {
    editingUserId.value = user.id;
    editForm.value = {
      name: user.name,
      email: user.email,
      role: user.role,
    };
  };

  const cancelEdit = () => {
    editingUserId.value = null;
    editForm.value = {
      name: '',
      email: '',
      role: 'user',
    };
  };

  const updateEditField = <K extends keyof EditableUserFields>(
    field: K,
    value: EditableUserFields[K]
  ) => {
    editForm.value = {
      ...editForm.value,
      [field]: value,
    };
  };

  const clearDateFilter = () => {
    dateFrom.value = '';
    dateTo.value = '';
  };

  const clearAllFilters = () => {
    searchQuery.value = '';
    filterRole.value = '';
    filterStatus.value = '';
    clearDateFilter();
  };

  watch(
    [searchQuery, filterRole, filterStatus, dateFrom, dateTo],
    () => {
      currentPage.value = 1;
    }
  );

  watch(pageSize, () => {
    currentPage.value = 1;
  });

  return {
    searchQuery,
    filterRole,
    filterStatus,
    dateFrom,
    dateTo,
    sortColumn,
    sortDirection,
    currentPage,
    pageSize,
    selectedUsers,
    editingUserId,
    editForm,
    filteredAndSearchedUsers,
    paginatedUsers,
    sortedUsers,
    totalPages,
    paginationStart,
    paginationEnd,
    visiblePages,
    isAllSelected,
    sortBy,
    goToPage,
    handlePageSizeChange,
    toggleSelectUser,
    toggleSelectAll,
    startEdit,
    cancelEdit,
    updateEditField,
    clearAllFilters,
    clearDateFilter,
  };
}