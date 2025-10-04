<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { Role } from '@prisma/client';

const { loggedIn, clear: clearUserSession, user } = useUserSession()

const items = computed<NavigationMenuItem[]>(() => {
  const items: NavigationMenuItem[] = [
    {
      label: 'Animations',
      to: '/animations',
    },
    {
      label: 'Buvette',
      to: '/buvette',
    }
  ];

  if (user.value?.role === Role.ADMIN) {
    items.push({
      label: 'Admin',
      to: '/admin',
    });
  }

  return items;
});

async function logout() {
  await clearUserSession();
  navigateTo('/login');
}
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <UHeader>
      <UNavigationMenu v-if="loggedIn" :items="items" />

      <template #right>
        <template v-if="loggedIn">
          <UButton @click="logout()">Logout</UButton>
        </template>
        <template v-else>
          <UButton to="/login">Login</UButton>
          <UButton to="/register">Register</UButton>
        </template>
      </template>
    </UHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

  </UApp>
</template>
