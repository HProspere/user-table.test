<script setup lang="ts">
import type { UserTableCompFiltersEmits, UserTableCompFiltersProps } from './UserTableCompFilters.interface.ts';
import { userStatusesList } from '@/constants/user.ts';
import type { UserStatus, ValueWithTitle } from '@/types/user.ts';

const {
  filterStatus = '',
  dateFrom = '',
  dateTo = '',
} = defineProps<UserTableCompFiltersProps>();

const emit = defineEmits<UserTableCompFiltersEmits>();

const userStatuses: ValueWithTitle<UserStatus>[] = [
  {
    title: 'Все',
    value: '',
  },
  ...userStatusesList,
];
</script>

<template>
  <div class="filters-section">
    <div class="filter-group">
      <label>Статус:</label>
      <button
        v-for="userStatus in userStatuses"
        :class="['filter-btn', { active: filterStatus === userStatus.value }]"
        type="button"
        @click="emit('update:filterStatus', userStatus.value)"
      >
        {{ userStatus.title }}
      </button>
    </div>

    <div class="filter-group">
      <label>Дата регистрации:</label>
      <input
        :value="dateFrom"
        type="date"
        class="date-input"
        @input="emit('update:dateFrom', ($event.target as HTMLInputElement).value)"
      />
      <span>-</span>
      <input
        :value="dateTo"
        type="date"
        class="date-input"
        @input="emit('update:dateTo', ($event.target as HTMLInputElement).value)"
      />
      <button
        class="btn-clear"
        type="button"
        @click="emit('clear-dates')"
      >
        Очистить
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/vars.scss";

.filters-section {
  background: white;
  padding: $spacing-15 $spacing-20;
  border-radius: $border-radius-xl;
  margin-bottom: $spacing-20;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter {
  &-group {
    display: flex;
    align-items: center;
    gap: $spacing-l;
    margin-bottom: $spacing-l;

    &:last-child {
      margin-bottom: 0;
    }

    & label {
      font-weight: 500;
      color: #555;
      min-width: 150px;
    }

    .date-input {
      padding: $spacing-s $spacing-l;
      border: 1px solid #ddd;
      border-radius: $border-radius-base;
      font-size: $font-size-base;
    }

    .btn-clear {
      padding: $spacing-s $spacing-xl;
      border: 1px solid #ddd;
      background: white;
      border-radius: $border-radius-base;
      cursor: pointer;
      font-size: $font-size-13;

      &:hover {
        background: #f0f0f0;
      }
    }
  }

  &-btn {
    padding: $spacing-s $spacing-xl;
    border: 1px solid #ddd;
    background: white;
    border-radius: $border-radius-base;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #f0f0f0;
    }

    &.active {
      background: #4caf50;
      color: white;
      border-color: #4caf50;
    }
  }
}
</style>