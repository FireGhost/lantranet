<script setup lang="ts">
import type { AnimationModel } from '~~/prisma/generated/prisma/models';

definePageMeta({
  layout: 'animations',
  middleware: "need-admin",
});

const route = useRoute();

const { data: animation } = await useFetch<Partial<AnimationModel>>(`/api/animations/${route.params.id}`, {
  default: () => ({}),
});
</script>

<template>
  <FormAnimation :animation="animation" />
</template>