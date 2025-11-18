<script setup lang="ts">
import type { UserTableCompPaginationEmits, UserTableCompPaginationProps } from './UserTableCompPagination.interface.ts';

const {
  paginationStart = 0,
  paginationEnd = 0,
  total = 0,
  currentPage = 0,
  totalPages = 0,
  visiblePages =[],
  pageSize = 25,
} = defineProps<UserTableCompPaginationProps>();

const emit = defineEmits<UserTableCompPaginationEmits>();

const goToPage = (page: number) => {
  emit('go-to-page', page);
};

const handlePageSizeChange = (event: Event) => {
  const value = Number((event.target as HTMLSelectElement).value);
  emit('update:pageSize', value);
};
</script>

<template>
  <div class="pagination">
    <div class="pagination-info">
      Показано {{ paginationStart }} - {{ paginationEnd }} из {{ total }}
    </div>

    <div class="pagination-controls">
      <button
        class="btn-page"
        type="button"
        :disabled="currentPage === 1"
        @click="goToPage(1)"
      >
        ⏮️
      </button>
      <button
        class="btn-page"
        type="button"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        ◀️
      </button>

      <template
        v-for="(page, index) in visiblePages"
        :key="`${page}-${index}`"
      >
        <button
          v-if="page !== '...'"
          class="btn-page"
          type="button"
          :class="{ active: currentPage === page }"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </button>
        <span v-else class="btn-page ellipsis">...</span>
      </template>

      <button
        class="btn-page"
        type="button"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        ▶️
      </button>
      <button
        class="btn-page"
        type="button"
        :disabled="currentPage === totalPages"
        @click="goToPage(totalPages)"
      >
        ⏭️
      </button>
    </div>

    <div class="page-size-selector">
      <label>На странице:</label>
      <select :value="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/vars.scss";

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: $spacing-20;
  padding: $spacing-15 $spacing-20;
  background: white;
  border-radius: $border-radius-xl;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &-info {
    color: #666;
    font-size: $font-size-base;
  }

  &-controls {
    display: flex;
    gap: 5px;
    align-items: center;
  }
}

.btn-page {
  padding: $spacing-s $spacing-xl;
  border: 1px solid #ddd;
  background: white;
  border-radius: $border-radius-base;
  cursor: pointer;
  font-size: $font-size-base;
  min-width: 36px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f0f0f0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    background: #4caf50;
    color: white;
    border-color: #4caf50;
  }

  &.ellipsis {
    cursor: default;
    border: none;
    background: transparent;
  }
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: $spacing-10;

  & label {
    color: #666;
    font-size: $font-size-base;
  }

  & select {
    padding: $spacing-s $spacing-10;
    border: 1px solid #ddd;
    border-radius: $border-radius-base;
    cursor: pointer;
    font-size: $font-size-base;
  }
}
</style>