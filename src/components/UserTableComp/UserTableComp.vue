<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUserData } from '@/composables/UserTableComp/useUserData.ts';
import { useUserTableCompState } from '@/composables/UserTableComp/useUserTableCompState.ts';
import { useUserModals } from '@/composables/UserTableComp/useUserModals.ts';
import { useUserFormatting } from '@/composables/UserTableComp/useUserFormatting.ts';
import type { UserTableCompProps } from './UserTableComp.interface.ts';
import UserTableCompHeader from '@/components/UserTableComp/UserTableCompHeader/UserTableCompHeader.vue';
import UserTableCompFilters from '@/components/UserTableComp/UserTableCompFilters/UserTableCompFilters.vue';
import type { EditableUserFields, NewUserForm, UserRole, UserStatus } from '@/types/user.ts';
import UserTableCompGrid from '@/components/UserTableComp/UserTableCompGrid/UserTableCompGrid.vue';
import UserTableCompPagination from '@/components/UserTableComp/UserTableCompPagination/UserTableCompPagination.vue';
import AddUserModal from '@/components/UserTableComp/AddUserModal/AddUserModal.vue';
import UserDetailsModal from '@/components/UserTableComp/UserDetailsModal/UserDetailsModal.vue';

const {
  title = 'Управление пользователями',
  initialPageSize = 25,
  apiEndpoint = '/api/users',
} = defineProps<UserTableCompProps>();

const {
  users,
  isLoading,
  isSaving,
  error,
  loadUsers,
  updateUser,
  deleteUser,
  deleteUsers,
  toggleUserStatus,
  addUser,
} = useUserData(apiEndpoint);

const {
  searchString,
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
} = useUserTableCompState({
  users,
  initialPageSize: initialPageSize,
});

const {
  showAddUserModal,
  showDetailsModal,
  selectedUser,
  newUser,
  newUserErrors,
  isNewUserValid,
  validateNewUserName,
  validateNewUserEmail,
  openAddUserModal,
  closeAddUserModal,
  openDetailsModal,
  closeDetailsModal,
} = useUserModals(users);

const { getRoleLabel, getStatusLabel, formatDate } = useUserFormatting();

const totalCount = computed(() => filteredAndSearchedUsers.value.length);
const canExport = computed(() => selectedUsers.value.length > 0);
const errorMessage = computed(() => error.value);

const retryLoad = () => loadUsers();

const updateSearchString = (value: string) => {
  searchString.value = value;
};

const updateFilterRole = (value: UserRole | '') => {
  filterRole.value = value;
};

const updateFilterStatus = (value: UserStatus | '') => {
  filterStatus.value = value;
};

const updateDateFrom = (value: string) => {
  dateFrom.value = value;
};

const updateDateTo = (value: string) => {
  dateTo.value = value;
};

const handlePageSizeUpdate = (value: number) => {
  pageSize.value = value;
  handlePageSizeChange();
};

const handleEditFieldUpdate = ({ field, value }: {
  field: keyof EditableUserFields;
  value: EditableUserFields[keyof EditableUserFields];
}) => {
  updateEditField(field, value);
};

const handleSaveEdit = async (userId: number) => {
  await updateUser(userId, editForm.value);
  cancelEdit();
};

const handleDeleteUser = async (userId: number) => {
  if (
    !confirm('Вы уверены, что хотите удалить этого пользователя?')
  ) {
    return;
  }
  await deleteUser(userId);
  selectedUsers.value = selectedUsers.value.filter((id) => id !== userId);
};

const handleDeleteSelectedUsers = async () => {
  if (selectedUsers.value.length === 0) {
    return;
  }
  if (
    !confirm(
      `Вы уверены, что хотите удалить ${selectedUsers.value.length} пользователей?`
    )
  ) {
    return;
  }
  await deleteUsers(selectedUsers.value);
  selectedUsers.value = [];
};

const handleToggleStatus = async (userId: number) => {
  await toggleUserStatus(userId);
};

const handleNewUserFieldUpdate = ({ field, value }: {
  field: keyof NewUserForm;
  value: string | boolean;
}) => {
  console.log('[handleNewUserFieldUpdate] field:', field);
  console.log('[handleNewUserFieldUpdate] value:', value);
  newUser.value = {
    ...newUser.value,
    [field]: value,
  } as NewUserForm;
};

const handleAddUserSubmit = async () => {
  validateNewUserName();
  validateNewUserEmail();
  if (!isNewUserValid.value) {
    return;
  }
  await addUser(newUser.value);
  closeAddUserModal();
};

const handleExport = () => {
  const usersToExport =
    selectedUsers.value.length > 0
      ? users.value.filter((user) => selectedUsers.value.includes(user.id))
      : sortedUsers.value;

  if (usersToExport.length === 0) {
    return;
  }

  const headers = [
    'ID',
    'Имя',
    'Email',
    'Роль',
    'Статус',
    'Дата регистрации',
  ];
  const rows = usersToExport.map((user) => [
    user.id,
    user.name,
    user.email,
    getRoleLabel(user.role),
    getStatusLabel(user.status),
    formatDate(user.registrationDate),
  ]);

  let csv = `${headers.join(",")}\n`;
  rows.forEach((row) => {
    csv += `${row.map((cell) => `"${cell}"`).join(",")}\n`;
  });

  const blob = new Blob(['\ufeff' + csv], {
    type: 'text/csv;charset=utf-8;',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `users_export_${Date.now()}.csv`;
  link.click();
};

onMounted(() => {
  loadUsers();
});

</script>

<template>
  <div class="user-table-container">
    <UserTableCompHeader
      :title="title"
      :total-count="totalCount"
      :search-string="searchString"
      :filter-role="filterRole"
      :is-loading="isLoading"
      :selected-count="selectedUsers.length"
      :can-export="canExport"
      @update:searchString="updateSearchString"
      @update:filterRole="updateFilterRole"
      @open-add-user="openAddUserModal"
      @export="handleExport"
      @delete-selection="handleDeleteSelectedUsers"
    />

    <UserTableCompFilters
      :filter-status="filterStatus"
      :date-from="dateFrom"
      :date-to="dateTo"
      @update:filterStatus="updateFilterStatus"
      @update:dateFrom="updateDateFrom"
      @update:dateTo="updateDateTo"
      @clear-dates="clearDateFilter"
    />

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner" />
      <p>Загрузка данных...</p>
    </div>

    <div v-else-if="errorMessage" class="error-message">
      <span>❌ {{ errorMessage }}</span>
      <button
        class="btn btn-secondary"
        type="button"
        @click="retryLoad"
      >
        Повторить
      </button>
    </div>

    <template v-else>
      <UserTableCompGrid
        :users="paginatedUsers"
        :selected-users="selectedUsers"
        :editing-user-id="editingUserId"
        :edit-form="editForm"
        :is-all-selected="isAllSelected"
        :sort-column="sortColumn"
        :sort-direction="sortDirection"
        @toggle-select-all="toggleSelectAll"
        @toggle-select="toggleSelectUser"
        @sort="sortBy"
        @start-edit="startEdit"
        @cancel-edit="cancelEdit"
        @save-edit="handleSaveEdit"
        @open-details="openDetailsModal"
        @delete-user="handleDeleteUser"
        @toggle-status="handleToggleStatus"
        @update-edit-field="handleEditFieldUpdate"
      >
        <template #empty-action>
          <button
            class="btn btn-primary"
            type="button"
            @click="clearAllFilters"
          >
            Сбросить фильтры
          </button>
        </template>
      </UserTableCompGrid>

      <UserTableCompPagination
        :pagination-start="paginationStart"
        :pagination-end="paginationEnd"
        :total="totalCount"
        :current-page="currentPage"
        :total-pages="totalPages"
        :visible-pages="visiblePages"
        :page-size="pageSize"
        @go-to-page="goToPage"
        @update:pageSize="handlePageSizeUpdate"
      />
    </template>

    <AddUserModal
      :visible="showAddUserModal"
      :new-user="newUser"
      :errors="newUserErrors"
      :is-saving="isSaving"
      :is-valid="isNewUserValid"
      @close="closeAddUserModal"
      @submit="handleAddUserSubmit"
      @update-field="handleNewUserFieldUpdate"
      @validate-name="validateNewUserName"
      @validate-email="validateNewUserEmail"
    />

    <UserDetailsModal
      :visible="showDetailsModal"
      :user="selectedUser"
      @close="closeDetailsModal"
    />
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/vars.scss";

.user-table-container {
  height: 100%;
  padding: 20px;
  background: #f5f5f5;
}
</style>