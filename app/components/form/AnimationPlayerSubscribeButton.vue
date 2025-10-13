<script setup lang="ts">

const props = defineProps<{
  animationId: Number,
}>();

const { data: isSoloSubscribed } = await useFetch(`/api/animations/${props.animationId}/subscribed`);

function unsubscribeSolo() {
  const subscribeBody: SubscribePost = {
    subscribe: false
  }

  useApi(
    `/api/animations/${props.animationId}/subscribe`,
    {
      fetchOptions: {
        method: 'POST',
        body: subscribeBody,
      },
      successString: 'You have been removed'
    }
  );
}

function subscribeSolo() {
  const subscribeBody: SubscribePost = {
    subscribe: true
  }
  useApi(
    `/api/animations/${props.animationId}/subscribe`,
    {
      fetchOptions: {
        method: 'POST',
        body: subscribeBody,
      },
      successString: 'Subscribed !'
    }
  );
}
</script>

<template>
  <UButton v-if="isSoloSubscribed" label="Je me retire" color="error" @click="unsubscribeSolo()" />
  <UButton v-else label="Inscris moi !" color="primary" @click="subscribeSolo()" />
</template>