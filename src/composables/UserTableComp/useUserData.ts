import { ref } from 'vue';
import type { EditableUserFields, NewUserForm, UserRecord, UserRole, UserStatus } from '@/types/user.ts';

const MOCK_NAMES = [
  'Иван Петров',
  'Мария Сидорова',
  'Алексей Иванов',
  'Елена Кузнецова',
  'Дмитрий Смирнов',
  'Ольга Попова',
  'Сергей Васильев',
  'Анна Соколова',
  'Николай Михайлов',
  'Татьяна Новикова',
];

const ROLES: Readonly<UserRole[]> = ['admin', 'user', 'moderator'];
const STATUSES: Readonly<UserStatus[]> = ['active', 'inactive'];

const pickRandom = <T>(items: readonly T[]): T => {
  if (items.length === 0) {
    throw new Error('Array must contain at least one item');
  }
  const index = Math.floor(Math.random() * items.length);
  return items[index] as T;
};

export function useUserData(apiEndpoint: string) {
  const users = ref<UserRecord[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);

  const delay = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });

  const generateMockUsers = (count: number): UserRecord[] => {
    const records: UserRecord[] = [];

    for (let i = 1; i <= count; i += 1) {
      const name = `${pickRandom(MOCK_NAMES)} ${i}`;
      const registrationDate = new Date(
        2020,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      );
      const lastActivity = new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      );

      records.push({
        id: i,
        name,
        email: `user${i}@example.com`,
        role: pickRandom(ROLES),
        status: pickRandom(STATUSES),
        registrationDate: registrationDate.toISOString(),
        lastActivity: lastActivity.toISOString(),
        avatar: null,
        loginCount: Math.floor(Math.random() * 500),
        postsCount: Math.floor(Math.random() * 100),
        commentsCount: Math.floor(Math.random() * 300),
      });
    }

    return records;
  };

  const loadUsers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // TODO: replace with real API call using apiEndpoint
      await delay(1000);
      users.value = generateMockUsers(100);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Неизвестная ошибка загрузки';
      error.value = `Ошибка загрузки данных: ${message}`;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUser = async (userId: number, payload: EditableUserFields) => {
    isSaving.value = true;
    try {
      await delay(500);
      users.value = users.value.map((user) =>
        user.id === userId ? { ...user, ...payload } : user
      );
    } finally {
      isSaving.value = false;
    }
  };

  const deleteUser = async (userId: number) => {
    await delay(300);
    users.value = users.value.filter((user) => user.id !== userId);
  };

  const deleteUsers = async (ids: number[]) => {
    await delay(500);
    users.value = users.value.filter((user) => !ids.includes(user.id));
  };

  const toggleUserStatus = async (userId: number) => {
    await delay(200);
    users.value = users.value.map((user) =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    );
  };

  const addUser = async (payload: NewUserForm) => {
    isSaving.value = true;
    try {
      await delay(1000);
      const nextId =
        users.value.length === 0
          ? 1
          : Math.max(...users.value.map((user) => user.id)) + 1;

      const now = new Date().toISOString();

      const newRecord: UserRecord = {
        id: nextId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        status: 'active',
        registrationDate: now,
        lastActivity: now,
        avatar: null,
        loginCount: 0,
        postsCount: 0,
        commentsCount: 0,
      };

      users.value = [newRecord, ...users.value];
    } finally {
      isSaving.value = false;
    }
  };

  return {
    apiEndpoint,
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
  };
}
