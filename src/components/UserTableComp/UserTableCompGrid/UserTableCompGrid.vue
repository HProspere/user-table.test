<script setup lang="ts">
import type {
  UserTableCompGridEmits,
  UserTableCompGridProps,
  UserTableCompGridSlots
} from './UserTableCompGrid.interface.ts';
import type { EditFieldPayload, SortDirection } from '@/types/table.ts';
import type { EditableUserFields } from '@/types/user.ts';
import { userRolesList } from '@/constants/user.ts';
import { useUserFormatting } from '@/composables/UserTableComp/useUserFormatting.ts';
import Badge from "@/components/Badge/Badge.vue";

const {
  users = [],
  selectedUsers = [],
  editingUserId = null,
  editForm,
  isAllSelected = false,
  sortColumn = 'id',
  sortDirection = 'asc',
} = defineProps<UserTableCompGridProps>();

const emit = defineEmits<UserTableCompGridEmits>();
defineSlots<UserTableCompGridSlots>();

const {
  getRoleLabel,
  getRoleBadgeColor,
  getStatusLabel,
  getStatusBadgeColor,
  formatDate,
  formatRelativeTime,
  getActivityClass,
  getDefaultAvatar
} =
  useUserFormatting();

const getSort = (direction: SortDirection): string  => {
  return direction === 'asc' ? '↑' : '↓';
}

const handleInput =
  (field: keyof EditableUserFields) => (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    emit('update-edit-field', {
      field,
      value: target.value as EditFieldPayload['value'],
    });
  };
</script>

<template>
  <div class="table-wrapper">
    <table class="user-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="emit('toggle-select-all')"
            />
          </th>
          <th
            :class="{ sortable: true, active: sortColumn === 'id' }"
            @click="emit('sort', 'id')"
          >
            ID
            <span v-if="sortColumn === 'id'">
              {{ getSort(sortDirection) }}
            </span>
          </th>
          <th
            :class="{ sortable: true, active: sortColumn === 'name' }"
            @click="emit('sort', 'name')"
          >
            Имя
            <span v-if="sortColumn === 'name'">
              {{ getSort(sortDirection) }}
            </span>
          </th>
          <th
            :class="{ sortable: true, active: sortColumn === 'email' }"
            @click="emit('sort', 'email')"
          >
            Email
            <span v-if="sortColumn === 'email'">
              {{ getSort(sortDirection) }}
            </span>
          </th>
          <th>Роль</th>
          <th>Статус</th>
          <th
            :class="{ sortable: true, active: sortColumn === 'registrationDate' }"
            @click="emit('sort', 'registrationDate')"
          >
            Дата регистрации
            <span v-if="sortColumn === 'registrationDate'">
              {{ getSort(sortDirection) }}
            </span>
          </th>
          <th>Последняя активность</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          :class="{
              selected: selectedUsers.includes(user.id),
              editing: editingUserId === user.id,
              inactive: user.status === 'inactive',
            }"
        >
          <td>
            <input
              type="checkbox"
              :checked="selectedUsers.includes(user.id)"
              @change="emit('toggle-select', user.id)"
            />
          </td>
          <td>{{ user.id }}</td>
          <td>
            <div v-if="editingUserId === user.id">
              <input
                :value="editForm.name"
                type="text"
                class="edit-input"
                @input="handleInput('name')"
              />
            </div>
            <div v-else class="user-name-cell">
              <img
                :src="user.avatar || getDefaultAvatar(user.name)"
                :alt="user.name"
                class="avatar"
              />
              <span>{{ user.name }}</span>
            </div>
          </td>
          <td>
            <div v-if="editingUserId === user.id">
              <input
                :value="editForm.email"
                type="email"
                class="edit-input"
                @input="handleInput('email')"
              />
            </div>
            <div v-else>{{ user.email }}</div>
          </td>
          <td>
            <div v-if="editingUserId === user.id">
              <select
                :value="editForm.role"
                class="edit-select"
                @change="handleInput('role')"
              >
                <option
                  v-for="role in userRolesList"
                  :value="role.value"
                >
                  {{ role.title }}
                </option>
              </select>
            </div>
            <Badge
              :title="getRoleLabel(user.role)"
              :color-style="getRoleBadgeColor(user.role)"
            />
          </td>
          <td>
            <Badge
              :title="getStatusLabel(user.status)"
              :color-style="getStatusBadgeColor(user.status)"
              clickable
              @click="emit('toggle-status', user.id)"
            />
          </td>
          <td>{{ formatDate(user.registrationDate) }}</td>
          <td>
            <span :class="getActivityClass(user.lastActivity)">
              {{ formatRelativeTime(user.lastActivity) }}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button
                v-if="editingUserId !== user.id"
                class="btn-icon"
                type="button"
                title="Редактировать"
                @click="emit('start-edit', user)"
              >
                ✏️
              </button>
              <button
                v-if="editingUserId === user.id"
                class="btn-icon btn-success"
                type="button"
                title="Сохранить"
                @click="emit('save-edit', user.id)"
              >
                ✓
              </button>
              <button
                v-if="editingUserId === user.id"
                class="btn-icon btn-cancel"
                type="button"
                title="Отмена"
                @click="emit('cancel-edit')"
              >
                ✗
              </button>
              <button
                v-if="editingUserId !== user.id"
                class="btn-icon"
                type="button"
                title="Подробнее"
                @click="emit('open-details', user)"
              >
                👁️
              </button>
              <button
                v-if="editingUserId !== user.id"
                class="btn-icon btn-danger"
                type="button"
                title="Удалить"
                @click="emit('delete-user', user.id)"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="users.length === 0" class="no-data">
      <p>😔 Нет данных для отображения</p>
      <slot name="empty-action" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/vars.scss";

.table-wrapper {
  background: white;
  border-radius: $spacing-base;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .user-table {
    width: 100%;
    border-collapse: collapse;

    & thead {
      background: #f5f5f5;
      border-bottom: 2px solid #ddd;
    }

    & th {
      padding: $spacing-xl;
      text-align: left;
      font-weight: 600;
      color: #555;
      font-size: $font-size-base;

      &.sortable {
        cursor: pointer;
        user-select: none;

        &:hover {
          background: #eeeeee;
        }
      }

      &.active {
        color: #4caf50;
      }
    }

    & td {
      padding: $spacing-xl;
      border-bottom: 1px solid #f0f0f0;
      font-size: $font-size-base;

      .user-name-cell {
        display: flex;
        align-items: center;
        gap: $spacing-10;

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .action-buttons {
        display: flex;
        gap: $spacing-5;

        .btn-icon {
          padding: $spacing-s $spacing-10;
          border: 1px solid #ddd;
          background: white;
          border-radius: $border-radius-base;
          cursor: pointer;
          font-size: $font-size-base;
          transition: all 0.2s;

          &:hover {
            background: #f0f0f0;
            transform: scale(1.05);
          }

          &.btn-success {
            background: #4caf50;
            color: white;
            border-color: #4caf50;
          }

          &.btn-cancel {
            background: #ff9800;
            color: white;
            border-color: #ff9800;
          }

          &.btn-danger {
            border-color: #f44336;

            &:hover {
              background: #f44336;
              color: white;
            }
          }
        }
      }

      .edit-input,
      .edit-select {
        padding: $spacing-s $spacing-10;
        border: 1px solid #4caf50;
        border-radius: $border-radius-base;
        width: 100%;
        font-size: $font-size-base;
      }

      .activity-recent {
        color: #2e7d32;
        font-weight: 500;
      }

      .activity-week {
        color: #1565c0;
      }

      .activity-month {
        color: #e65100;
      }

      .activity-old {
        color: #757575;
      }
    }

    & tbody tr {
      transition: background 0.2s;

      &:hover {
        background: #fafafa;
      }

      &.selected {
        background: #e8f5e9;
      }

      &.editing {
        background: #fff9c4;
      }

      &.inactive {
        opacity: 0.6;
      }
    }
  }

  .no-data p {
    font-size: $font-size-xl;
    margin-bottom: $spacing-20;
  }
}
</style>