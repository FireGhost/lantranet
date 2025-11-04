<script setup lang="ts">
import type { AnimationGetPayload, UserModel } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  animation: AnimationGetPayload<{
    include: {
      players: true,
    },
  }>,
}>();

const { data: users } = useFetch<UserModel[]>("/api/users", {
  default: () => [],
});
const subscribedUsers = computed(() => {
  return users.value.filter((user) => {
    return props.animation.players.find((subscribedPlayer) => subscribedPlayer.playerId === user.id);
  });
});
const notSubscribedUsers = computed(() => {
  return users.value.filter((user) => {
    return !props.animation.players.find((subscribedPlayer) => subscribedPlayer.playerId === user.id);
  });
});
</script>

<template>
  <div class="mb-2">Subscribed players</div>
  <template v-for="subscribedUser in subscribedUsers" :key="subscribedUser.id">
    <UFieldGroup class="w-2/3 flex">
      <UBadge :label="subscribedUser.username" class="flex-1" variant="outline" color="neutral" />
      <UButton icon="i-lucide-user-minus" color="error" />
    </UFieldGroup>
  </template>

  <USeparator class="mb-2 mt-4" />

  <div class="mb-2">Not subscribed players</div>
  <template v-for="notSubscribedUser in notSubscribedUsers" :key="notSubscribedUser.id">
    <UFieldGroup class="w-2/3 flex">
      <UBadge :label="notSubscribedUser.username" class="flex-1" variant="outline" color="neutral" />
      <UButton icon="i-lucide-user-plus" color="success" />
    </UFieldGroup>
  </template>
</template>
