import type { UserRole, UserStatus } from '@/types/user.ts';
import { userRolesList, userStatusesList } from '@/constants/user.ts';

export function useUserFormatting() {
  const getRoleLabel = (role: UserRole): string => {
    return userRolesList.find(el => el.value === role)?.title ?? role;
  };

  const getStatusLabel = (status: UserStatus): string => {
    return userStatusesList.find(el => el.value === status)?.title ?? status;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 30) return `${diffDays} дн. назад`;
    return formatDate(dateString);
  };

  const getActivityClass = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffDays < 1) return 'activity-recent';
    if (diffDays < 7) return 'activity-week';
    if (diffDays < 30) return 'activity-month';
    return 'activity-old';
  };

  const getDefaultAvatar = (name: string): string => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
    ] as const;
    const safeName = name.trim() || 'U';
    const initial = safeName.charAt(0).toUpperCase();
    const charCode = safeName.charCodeAt(0);
    const colorIndex = Number.isNaN(charCode) ? 0 : charCode % colors.length;
    const color = colors[colorIndex] ?? colors[0];

    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='${encodeURIComponent(
      color
    )}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`;
  };

  return {
    getRoleLabel,
    getStatusLabel,
    formatDate,
    formatRelativeTime,
    getActivityClass,
    getDefaultAvatar,
  };
}