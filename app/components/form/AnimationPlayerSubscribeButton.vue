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
    successString: $t("You have been removed"),
    onSuccess: () => {
      refreshSubscriptionData();
      emit("playerSubscriptionUpdated");
    },
  });
}

function subscribeSolo() {
  if (!user.value) {
    useToast().add({
      title: $t("Please login again"),
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
    successString: $t("Subscribed !"),
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
      :label="$t('Unsubscribe me')"
      color="error"
      @click="unsubscribeSolo()"
    />
    <UButton
      v-else
      :label="$t('Subscribe me !')"
      color="primary"
      @click="subscribeSolo()"
    />
  </div>
</template>
