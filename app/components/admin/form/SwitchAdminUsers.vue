<script setup lang="ts">
import type { UserModel, UserUpdateInput } from '~~/prisma/generated/prisma/models';
import { Role } from '~~/prisma/generated/prisma/enums';

const { data: users } = await useFetch<UserModel[]>('/api/users');

function onAdminChange(user: UserModel) {
  useApi(
    `/api/users/${user.id}`,
    {
      fetchOptions: {
        method: 'PUT',
        body: {
          role: user.role === Role.ADMIN ? Role.USER : Role.ADMIN,
        } satisfies UserUpdateInput
      },
      successString: 'User updated',
    }
  );
}
</script>

<template>
  <div v-for="user in users" :key="user.id">
    <UFieldGroup>
      <UBadge color="neutral" variant="outline" size="lg" :label="user.username" />
      <UBadge color="neutral" variant="outline">
        <USwitch @change="onAdminChange(user)" :defaultValue="user.role === Role.ADMIN" />
      </UBadge>
    </UFieldGroup>
  </div>
</template>