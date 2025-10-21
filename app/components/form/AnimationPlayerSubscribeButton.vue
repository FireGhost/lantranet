<script setup lang="ts">
import type { AnimationsPlayersUncheckedCreateWithoutAnimationInput } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  animationId: Number,
}>();

const emit = defineEmits<{
  (e: 'playerSubscriptionUpdated'): void,
}>();

const { user } = useUserSession();

const { data: playerSubscription, refresh: refreshSubscriptionData } = await useFetch(`/api/animations/${props.animationId}/players/${user.value?.id}`);

function unsubscribeSolo() {
  useApi(
    `/api/animations/${props.animationId}/players/${user.value?.id}`,
    {
      fetchOptions: {
        method: 'DELETE',
      },
      successString: 'You have been removed',
      onSuccess: () => {
        refreshSubscriptionData();
        emit('playerSubscriptionUpdated');
      }
    }
  );
}

function subscribeSolo() {
  if (!user.value) {
    useToast().add({
      title: 'Please login again',
    });
    return;
  }

  useApi(
    `/api/animations/${props.animationId}/players`,
    {
      fetchOptions: {
        method: 'POST',
        body: {
          playerId: user.value.id,
        } satisfies AnimationsPlayersUncheckedCreateWithoutAnimationInput,
      },
      successString: 'Subscribed !',
      onSuccess: () => {
        refreshSubscriptionData();
        emit('playerSubscriptionUpdated');
      }
    }
  );
}
</script>

<template>
  <UButton v-if="playerSubscription" label="Je me retire" color="error" @click="unsubscribeSolo()" />
  <UButton v-else label="Inscris moi !" color="primary" @click="subscribeSolo()" />
</template>