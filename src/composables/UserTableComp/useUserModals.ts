import { computed, ref, type Ref } from 'vue';
import type { NewUserErrors, NewUserForm, UserRecord } from '@/types/user.ts';

const createEmptyForm = (): NewUserForm => ({
  name: '',
  email: '',
  role: 'user',
  sendWelcomeEmail: true,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useUserModals(users: Ref<UserRecord[]>) {
  const showAddUserModal = ref(false);
  const showDetailsModal = ref(false);
  const selectedUser = ref<UserRecord | null>(null);

  const newUser = ref<NewUserForm>(createEmptyForm());
  const newUserErrors = ref<NewUserErrors>({
    name: '',
    email: '',
  });

  const validateNewUserName = () => {
    const value = newUser.value.name.trim();
    if (value.length === 0) {
      newUserErrors.value.name = 'Имя обязательно для заполнения';
    } else if (value.length < 3) {
      newUserErrors.value.name = 'Имя должно содержать минимум 3 символа';
    } else {
      newUserErrors.value.name = "";
    }
  };

  const validateNewUserEmail = () => {
    const value = newUser.value.email.trim();
    if (value.length === 0) {
      newUserErrors.value.email = 'Email обязателен для заполнения';
    } else if (!EMAIL_REGEX.test(value)) {
      newUserErrors.value.email = 'Некорректный формат email';
    } else if (users.value.some((user) => user.email === value)) {
      newUserErrors.value.email = 'Пользователь с таким email уже существует';
    } else {
      newUserErrors.value.email = "";
    }
  };

  const isNewUserValid = computed(() => {
    return (
      newUser.value.name.trim().length > 0 &&
      newUser.value.email.trim().length > 0 &&
      EMAIL_REGEX.test(newUser.value.email) &&
      !newUserErrors.value.name &&
      !newUserErrors.value.email
    );
  });

  const openAddUserModal = () => {
    showAddUserModal.value = true;
    newUser.value = createEmptyForm();
    newUserErrors.value = { name: '', email: '' };
  };

  const closeAddUserModal = () => {
    showAddUserModal.value = false;
  };

  const openDetailsModal = (user: UserRecord) => {
    selectedUser.value = user;
    showDetailsModal.value = true;
  };

  const closeDetailsModal = () => {
    showDetailsModal.value = false;
    selectedUser.value = null;
  };

  return {
    showAddUserModal,
    showDetailsModal,
    selectedUser,
    newUser,
    newUserErrors,
    isNewUserValid,
    validateNewUserName,
    validateNewUserEmail,
    openAddUserModal,
    closeAddUserModal,
    openDetailsModal,
    closeDetailsModal,
  };
}