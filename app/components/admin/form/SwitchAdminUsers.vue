<script setup lang="ts">
import type { UserModel } from '~~/prisma/generated/prisma/models';
import { Role } from '~~/prisma/generated/prisma/enums';

const { data: users } = await useFetch<UserModel[]>('/api/users');

function onAdminChange(userId: number) {
  useApi(
    `/api/users/${userId}/toggle-admin`,
    {
      fetchOptions: {
        method: 'POST',
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
        <USwitch @change="onAdminChange(user.id)" :defaultValue="user.role === Role.ADMIN" />
      </UBadge>
    </UFieldGroup>
  </div>
</template>