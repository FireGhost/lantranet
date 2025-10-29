<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { Role } from "~~/prisma/generated/prisma/enums";

useHead({
  titleTemplate: (title) => {
    return title ? `${title} - Lantranet` : "Lantranet";
  },
});

const { loggedIn, clear: clearUserSession, user } = useUserSession();

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
      label: "Animations",
      to: "/animations",
    },
    {
      label: "Buvette",
      to: "/buvette",
    },
  ];

  if (user.value?.role === Role.ADMIN) {
    items.push({
      label: "Admin",
      to: "/admin",
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

    <UHeader>
      <UNavigationMenu v-if="loggedIn" :items="items" />

      <template #right>
        <template v-if="loggedIn">
          <ULink to="/user" variant="link" class="mr-2">{{ user?.username }}</ULink>
          <UColorModeButton class="mr-2" />
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
