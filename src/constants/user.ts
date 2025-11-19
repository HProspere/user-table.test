import type { UserRole, UserStatus, ValueWithTitle } from '@/types/user.ts';

export const userRolesList: ValueWithTitle<UserRole>[] = [
  {
    title: 'Администратор',
    value: 'admin',
    badgeStyle: 'negative',
  },
  {
    title: 'Пользователь',
    value: 'user',
    badgeStyle: 'neutral',
  },
  {
    title: 'Модератор',
    value: 'moderator',
    badgeStyle: 'warning',
  },
];

export const userStatusesList: ValueWithTitle<UserStatus>[] = [
  {
    title: 'Активные',
    value: 'active',
    label: '✓ Активен',
    badgeStyle: 'positive',
  },
  {
    title: 'Неактивные',
    value: 'inactive',
    label: '✗ Неактивен',
    badgeStyle: 'negative',
  },
];
