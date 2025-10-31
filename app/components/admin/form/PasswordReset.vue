<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

const { data: usersItems } = useFetch('/api/users', {
  transform: ((users) => {
    return users.map((user) => ({
      label: user.username,
      value: user.id,
    }) as SelectItem);
  }),
});

const newPassword = ref('');
const selectedUser = ref(null);

function updatePassword() {
  useApi(`/api/users/${selectedUser.value}/change-password`, {
    fetchOptions: {
      method: 'PUT',
      body: {
        currentPassword: '',
        newPassword: newPassword.value,
        newPasswordValidation: '',
      } satisfies PasswordChangeInput,
    },
    successString: 'Password updated with success',
    onSuccess: () => newPassword.value = '',
  });
}
</script>

<template>
  <UForm @submit="updatePassword">
    <UFieldGroup>
      <USelect v-model="selectedUser" :items="usersItems" class="w-52" />
      <UInput v-model="newPassword" class="w-52" />
      <UButton type="submit" icon="i-lucide-save" />
    </UFieldGroup>
  </UForm>
</template>
