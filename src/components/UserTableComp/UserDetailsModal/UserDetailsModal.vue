<script setup lang="ts">
import { computed } from 'vue';
import type { UserDetailsModalEmits, UserDetailsModalProps } from './UserDetailsModal.interface.ts';
import { useUserFormatting } from '@/composables/UserTableComp/useUserFormatting.ts';
import Badge from "@/components/Badge/Badge.vue";

const { visible, user } = defineProps<UserDetailsModalProps>();

const emit = defineEmits<UserDetailsModalEmits>();

const {
  getRoleLabel,
  getRoleBadgeColor,
  getStatusLabel,
  getStatusBadgeColor,
  formatDate,
  formatRelativeTime,
  getDefaultAvatar,
} = useUserFormatting();

const hasUser = computed(() => !!user);
const avatarSrc = computed(() => {
  if (!user) {
    return '';
  }
  return user.avatar || getDefaultAvatar(user.name);
});
</script>

<template>
  <div
    v-if="visible"
    class="modal-overlay"
    @click.self="emit('close')"
  >
    <div class="modal modal-large">
      <div class="modal-header">
        <h3>Информация о пользователе</h3>
        <button
          class="btn-close"
          type="button"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <div
        v-if="hasUser && user"
        class="modal-body"
      >
        <div class="user-details">
          <div class="detail-section">
            <img :src="avatarSrc" :alt="user.name" class="avatar-large" />
            <h2>{{ user.name }}</h2>
            <p class="user-email">{{ user.email }}</p>
          </div>

          <div class="detail-section">
            <h4>Основная информация</h4>
            <div class="detail-row">
              <span class="label">ID:</span>
              <span>{{ user.id }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Роль:</span>
              <Badge
                :title="getRoleLabel(user.role)"
                :color-style="getRoleBadgeColor(user.role)"
              />
            </div>
            <div class="detail-row">
              <span class="label">Статус:</span>
              <Badge
                :title="getStatusLabel(user.status)"
                :color-style="getStatusBadgeColor(user.status)"
              />
            </div>
            <div class="detail-row">
              <span class="label">Дата регистрации:</span>
              <span>{{ formatDate(user.registrationDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Последняя активность:</span>
              <span>{{ formatRelativeTime(user.lastActivity) }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>Статистика</h4>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ user.loginCount || 0 }}</div>
                <div class="stat-label">Входов</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ user.postsCount || 0 }}</div>
                <div class="stat-label">Постов</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ user.commentsCount || 0 }}</div>
                <div class="stat-label">Комментариев</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn btn-secondary"
          type="button"
          @click="emit('close')"
        >
          Закрыть
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

  .modal {
    background: white;
    border-radius: $border-radius-xl;
    width: 90%;
    max-width: 700px;
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

    .modal-body {
      padding: $spacing-20;

      .user-details {
        display: flex;
        flex-direction: column;
        gap: $spacing-20;

        .detail-section {
          padding: $spacing-15;
          background: #f9f9f9;
          border-radius: $border-radius-l;

          & h2 {
            text-align: center;
            margin: 0 0 $spacing-5 0;
            font-size: $font-size-22;
          }

          & h4 {
            margin: 0 0 $spacing-15 0;
            color: #333;
            font-size: $font-size-l;
          }

          .avatar-large {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 auto $spacing-15;
            display: block;
          }

          .user-email {
            color: #666;
            text-align: center;
            margin: $spacing-5 0 0 0;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: $spacing-10 0;
            border-bottom: 1px solid #eee;

            &:last-child {
              border-bottom: none;
            }

            & .label {
              font-weight: 500;
              color: #666;
            }
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: $spacing-15;

            .stat-card {
              background: white;
              padding: $spacing-15;
              border-radius: $border-radius-l;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

              .stat-value {
                font-size: $font-size-24;
                font-weight: bold;
                color: #4caf50;
                margin-bottom: $spacing-5;
              }

              .stat-label {
                font-size: $font-size-s;
                color: #666;
                text-transform: uppercase;
              }
            }
          }
        }
      }
    }

    .modal-footer {
      padding: $spacing-20;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>