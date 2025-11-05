<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { Role } from "~~/prisma/generated/prisma/enums";

const settingsStrings = useSettingsStrings();
const appName = await settingsStrings.get('app-name');

useHead({
  titleTemplate: (title) => {
    return title ? `${title} - ${appName}` : appName;
  },
});

const { loggedIn, clear: clearUserSession, user } = useUserSession();
const route = useRoute();

let eventSource: EventSource | null = null;
onMounted(() => {
  eventSource = new EventSource("/api/sse/connect");
  eventSource.addEventListener("data-updated", () => {
    refreshNuxtData();
  });
});

onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
  }
});

const items = computed<NavigationMenuItem[]>(() => {
  const items: NavigationMenuItem[] = [
    {
      label: $t('animations'),
      to: "/animations",
      active: route.path.startsWith('/animations'),
    },
    {
      label: $t('buvette'),
      to: "/buvette",
      active: route.path.startsWith('/buvette'),
    },
  ];

  if (user.value?.role === Role.ADMIN) {
    items.push({
      label: $t('admin'),
      to: "/admin",
      active: route.path.startsWith('/admin'),
    });
  }

  return items;
});

async function logout() {
  await clearUserSession();
  navigateTo("/login");
}
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <UHeader :title="appName">
      <UNavigationMenu v-if="loggedIn" :items="items" />

      <template #right>
        <template v-if="loggedIn">
          <ULink to="/user" variant="link" class="mr-2">{{ user?.username }}</ULink>
          <UColorModeButton class="mr-2" />
          <UButton @click="logout()">{{ $t('logout') }}</UButton>
        </template>
        <template v-else>
          <UButton to="/login">{{ $t('login') }}</UButton>
          <UButton to="/register">{{ $t('register') }}</UButton>
        </template>
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical"/>
      </template>
    </UHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>
  </UApp>
</template>
