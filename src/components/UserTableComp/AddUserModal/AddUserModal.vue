<script setup lang="ts">
import type { AddUserModalProps, AddUserModalEmits } from './AddUserModal.interface.ts';
import type { NewUserForm } from '@/types/user.ts';
import { userRolesList } from '@/constants/user.ts';

const {
  visible,
  newUser,
  errors,
  isSaving,
  isValid,
} = defineProps<AddUserModalProps>();

const emit = defineEmits<AddUserModalEmits>();

const handleInput =
  (field: keyof NewUserForm, validate?: () => void) =>
    (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      const value =
        target.type === 'checkbox'
          ? (target as HTMLInputElement).checked
          : target.value;

      emit('update-field', { field, value });

      if (validate) {
        validate();
      }
    };
</script>

<template>
  <div
    v-if="visible"
    class="modal-overlay"
    @click.self="emit('close')"
  >
    <div class="modal">
      <div class="modal-header">
        <h3>Добавить нового пользователя</h3>
        <button
          class="btn-close"
          type="button"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Имя*</label>
          <input
            :value="newUser.name"
            type="text"
            :class="{ error: !!errors.name }"
            @input="handleInput('name', () => emit('validate-name'))"
          />
          <span v-if="errors.name" class="error-text">
            {{ errors.name }}
          </span>
        </div>

        <div class="form-group">
          <label>Email*</label>
          <input
            :value="newUser.email"
            type="email"
            :class="{ error: !!errors.email }"
            @input="handleInput('email', () => emit('validate-email'))"
          />
          <span v-if="errors.email" class="error-text">
            {{ errors.email }}
          </span>
        </div>

        <div class="form-group">
          <label>Роль*</label>
          <select
            :value="newUser.role"
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

        <div class="form-group checkbox">
          <label>
            <input
              type="checkbox"
              :checked="newUser.sendWelcomeEmail"
              @change="handleInput('sendWelcomeEmail')"
            />
            Отправить приветственное письмо
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn btn-secondary"
          type="button"
          @click="emit('close')"
        >
          Отмена
        </button>
        <button
          class="btn btn-primary"
          type="button"
          :disabled="!isValid || isSaving"
          @click="emit('submit')"
        >
          {{ isSaving ? 'Сохранение...' : 'Добавить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/vars.scss";

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: $border-radius-xl;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-20;
    border-bottom: 1px solid #eee;

    & h3 {
      margin: 0;
      font-size: $font-size-xxl;
      color: #333;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: $font-size-24;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius-base;

      &:hover {
        background: #f0f0f0;
        color: #333;
      }
    }
  }

  &-body {
    padding: $spacing-20;

    .form-group {
      margin-bottom: $spacing-20;

      & label {
        display: block;
        margin-bottom: $spacing-base;
        font-weight: 500;
        color: #555;
      }

      & input[type="text"],
      & input[type="email"],
      & select {
        width: 100%;
        padding: $spacing-10;
        border: 1px solid #ddd;
        border-radius: $border-radius-base;
        font-size: $font-size-base;
      }

      & input.error {
        border-color: #f44336;
      }

      &.checkbox label {
        display: flex;
        align-items: center;
        gap: $spacing-base;
        margin: 0;
      }

      .error-text {
        color: #f44336;
        font-size: $font-size-s;
        margin-top: $spacing-5;
        display: block;
      }
    }
  }

  .modal-footer {
    padding: $spacing-20;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: $spacing-10;
  }
}


</style>