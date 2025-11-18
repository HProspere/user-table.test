import type { UserRole, UserStatus, ValueWithTitle } from '@/types/user.ts';

export const userRolesList: ValueWithTitle<UserRole>[] = [
  {
    title: 'Администратор',
    value: 'admin',
  },
  {
    title: 'Пользователь',
    value: 'user',
  },
  {
    title: 'Модератор',
    value: 'moderator',
  },
];

export const userStatusesList: ValueWithTitle<UserStatus>[] = [
  {
    title: 'Активные',
    value: 'active',
  },
  {
    title: 'Неактивные',
    value: 'inactive',
  },
];
