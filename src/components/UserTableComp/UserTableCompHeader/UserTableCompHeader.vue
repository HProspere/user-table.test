<script setup lang="ts">
import type { UserRole, ValueWithTitle } from '@/types/user.ts';
import type { UserTableCompHeaderProps, UserTableCompHeaderEmits } from './UserTableCompHeader.interface.ts';
import { userRolesList } from '@/constants/user.ts';

const {
  title = '',
  totalCount = 0,
  searchString = '',
  filterRole = '',
  selectedCount = 0,
  isLoading = false,
  canExport = false,
} = defineProps<UserTableCompHeaderProps>()

const emit = defineEmits<UserTableCompHeaderEmits>();

const userRoles: ValueWithTitle<UserRole>[] = [
  {
    title: 'Все роли',
    value: '',
  },
  ...userRolesList,
]

const handleSearchInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:searchString', value);
};

const handleRoleChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as UserRole | '';
  emit('update:filterRole', value);
};
</script>

<template>
  <div class="table-header">
    <div class="header-left">
      <h2>{{ title }}</h2>
      <span class="total-count">{{ totalCount }} записей</span>
    </div>

    <div class="header-right">
      <input
        :value="searchString"
        type="text"
        placeholder="Поиск по имени, email..."
        class="search-input"
        @input="handleSearchInput"
      />

      <select
        :value="filterRole"
        class="role-filter"
        @change="handleRoleChange"
      >
        <option
          v-for="role in userRoles"
          :value="role.value"
        >
          {{ role.title }}
        </option>
      </select>

      <button
        class="btn btn-primary"
        type="button"
        :disabled="isLoading"
        @click="emit('open-add-user')"
      >
        + Добавить пользователя
      </button>

      <button
        class="btn btn-secondary"
        type="button"
        :disabled="isLoading || !canExport"
        @click="emit('export')"
      >
        📥 Экспорт
      </button>

      <button
        v-if="selectedCount > 0"
        class="btn btn-danger"
        type="button"
        @click="emit('delete')"
      >
        🗑️ Удалить выбранные ({{ selectedCount }})
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/vars.scss";

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-20;
  background: white;
  padding: $spacing-20;
  border-radius: $spacing-base;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-15;

    & h2 {
      margin: 0;
      font-size: $font-size-24;
      color: #333;
    }

    .total-count {
      font-size: $font-size-base;
      color: #666;
    }
  }

  .header-right {
    display: flex;
    gap: $spacing-l;
    align-items: center;

    .search-input {
      padding: $spacing-base $spacing-xl;
      border: 1px solid #ddd;
      border-radius: $border-radius-base;
      width: 250px;
      font-size: $font-size-base;

      &:focus {
        outline: none;
        border-color: #4caf50;
      }
    }

    .role-filter {
      padding: $spacing-base $spacing-xl;
      border: 1px solid #ddd;
      border-radius: $border-radius-base;
      cursor: pointer;
      font-size: $font-size-base;
    }

    .btn {
      padding: $spacing-base $spacing-xxl;
      border: none;
      border-radius: $border-radius-base;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      font-size: $font-size-base;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &-primary {
        background: #4caf50;
        color: white;

        &:hover:not(:disabled) {
          background: #45a049;
        }
      }

      &-secondary {
        background: #2196f3;
        color: white;

        &:hover:not(:disabled) {
          background: #0b7dda;
        }
      }

      &-danger {
        background: #f44336;
        color: white;

        &:hover:not(:disabled) {
          background: #da190b;
        }
      }
    }
  }
}
</style>