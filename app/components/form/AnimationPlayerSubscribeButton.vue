<script setup lang="ts">
import type { AnimationGetPayload, AnimationsPlayersCreateInput } from "~~/prisma/generated/prisma/models";

const props = defineProps<{
  animation: AnimationGetPayload<{
    include: {
      players: true,
    },
  }>,
}>();

const emit = defineEmits<{
  (e: "playerSubscriptionUpdated"): void;
}>();

const { user } = useUserSession();

const { data: playerSubscription, refresh: refreshSubscriptionData } =
  await useFetch(
    `/api/animations/${props.animation.id}/players/${user.value?.id}`,
  );

function unsubscribeSolo() {
  useApi(`/api/animations/${props.animation.id}/players/${user.value?.id}`, {
    fetchOptions: {
      method: "DELETE",
    },
    successString: "You have been removed",
    onSuccess: () => {
      refreshSubscriptionData();
      emit("playerSubscriptionUpdated");
    },
  });
}

function subscribeSolo() {
  if (!user.value) {
    useToast().add({
      title: "Please login again",
    });
    return;
  }

  useApi(`/api/animations/${props.animation.id}/players`, {
    fetchOptions: {
      method: "POST",
      body: {
        animation: {
          connect: {
            id: Number(props.animation.id),
          },
        },
        player: {
          connect: {
            id: user.value.id,
          },
        },
      } satisfies AnimationsPlayersCreateInput,
    },
    successString: "Subscribed !",
    onSuccess: () => {
      refreshSubscriptionData();
      emit("playerSubscriptionUpdated");
    },
  });
}
</script>

<template>
  <div class="w-fit m-auto">
    <UButton
      v-if="playerSubscription"
      label="Je me retire"
      color="error"
      @click="unsubscribeSolo()"
    />
    <UButton
      v-else
      label="Inscris moi !"
      color="primary"
      @click="subscribeSolo()"
    />
  </div>
</template>
