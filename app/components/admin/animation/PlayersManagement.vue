<script setup lang="ts">
import type {
  AnimationGetPayload,
  AnimationsPlayersCreateInput,
  UserModel,
} from "~~/prisma/generated/prisma/models";

const props = defineProps<{
  animation: AnimationGetPayload<{
    include: {
      players: true;
    };
  }>;
}>();

const emit = defineEmits<{
  animationUpdated: [];
}>();

const { data: users } = useFetch<UserModel[]>("/api/users", {
  default: () => [],
});
const subscribedUsers = computed(() => {
  return users.value.filter((user) => {
    return props.animation.players.find(
      (subscribedPlayer) => subscribedPlayer.playerId === user.id,
    );
  });
});
const notSubscribedUsers = computed(() => {
  return users.value.filter((user) => {
    return !props.animation.players.find(
      (subscribedPlayer) => subscribedPlayer.playerId === user.id,
    );
  });
});

function subscribePlayer(userId: number) {
  useApi(`/api/animations/${props.animation.id}/players`, {
    fetchOptions: {
      method: "POST",
      body: {
        animation: {
          connect: {
            id: props.animation.id,
          },
        },
        player: {
          connect: {
            id: userId,
          },
        },
      } satisfies AnimationsPlayersCreateInput,
    },
    successString: $t("Player added"),
    onSuccess: () => emit("animationUpdated"),
  });
}

function unsubscribePlayer(userId: number) {
  useApi(`/api/animations/${props.animation.id}/players/${userId}`, {
    fetchOptions: {
      method: "DELETE",
    },
    successString: $t("Player removed"),
    onSuccess: () => emit("animationUpdated"),
  });
}
</script>

<template>
  <div class="mb-2">{{ $t("Subscribed players") }}</div>
  <template v-for="subscribedUser in subscribedUsers" :key="subscribedUser.id">
    <UFieldGroup class="w-2/3 flex">
      <UBadge
        :label="subscribedUser.username"
        class="flex-1"
        variant="outline"
        color="neutral"
      />
      <UButton
        icon="i-lucide-user-minus"
        color="error"
        @click="unsubscribePlayer(subscribedUser.id)"
      />
    </UFieldGroup>
  </template>

  <USeparator class="mb-2 mt-4" />

  <div class="mb-2">{{ $t("Not subscribed players") }}</div>
  <template
    v-for="notSubscribedUser in notSubscribedUsers"
    :key="notSubscribedUser.id"
  >
    <UFieldGroup class="w-2/3 flex">
      <UBadge
        :label="notSubscribedUser.username"
        class="flex-1"
        variant="outline"
        color="neutral"
      />
      <UButton
        icon="i-lucide-user-plus"
        color="success"
        @click="subscribePlayer(notSubscribedUser.id)"
      />
    </UFieldGroup>
  </template>
</template>
