<script setup lang="ts">
import type { UserUpdateInput } from '~~/prisma/generated/prisma/models';

const toast = useToast();
const { user, fetch: refreshUser } = useUserSession();

const newUsername = ref(user.value?.username);
const passwordChangeState = reactive<Partial<PasswordChangeInput>>({});

function updateUsername() {
  if (!user.value) {
    toast.add({
      title: 'Please login',
      color: 'error',
    });
    return;
  }

  useApi(`/api/users/${user.value.id}`, {
    fetchOptions: {
      method: 'PUT',
      body: {
        username: newUsername.value
      } satisfies UserUpdateInput
    },
    successString: 'User updated',
    onSuccess: () => refreshUser(),
  });
}

function updatePassword() {
  useApi(`/api/users/${user.value?.id}/change-password`, {
    fetchOptions: {
      method: 'PUT',
      body: passwordChangeState
    },
    successString: 'Password updated with success',
  });
}
</script>

<template>
  <div class="pt-4 flex flex-wrap gap-8 justify-center">
    <UCard class="w-fit">
      <template #header>Edit my username</template>
        <UForm @submit="updateUsername">
          <UFormField label="New username">
            <UFieldGroup>
              <UInput v-model="newUsername" type="text" />
              <UButton type="submit" icon="i-lucide-save" />
            </UFieldGroup>
          </UFormField>
        </UForm>
    </UCard>

    <UCard class="w-fit">
      <template #header>Edit my password</template>
        <UForm :schema="PasswordChangeSchema" :state="passwordChangeState" @submit="updatePassword">
          <UFormField label="Current password" name="currentPassword">
            <UInput v-model="passwordChangeState.currentPassword" type="password" />
          </UFormField>
          
          <UFormField label="New password" class="mt-2" name="newPassword">
            <UInput v-model="passwordChangeState.newPassword" type="password" />
          </UFormField>
          
          <UFormField label="Verify new password" class="mt-2" name="newPasswordValidation">
            <UInput v-model="passwordChangeState.newPasswordValidation" type="password" />
          </UFormField>

          <UButton type="submit" label="Save new password" class="mt-4" />
        </UForm>
    </UCard>
  </div>
</template>
