<script setup lang="ts">
import type { AnimationModel } from '~~/prisma/generated/prisma/models';

const { data: animations } = await useFetch<AnimationModel[]>('/api/animations');
</script>

<template>
  <ULink v-for="animation in animations" :key="animation.id" :to="`/animations/${animation.id}`" class="block">
    {{ animation.name }}
  </ULink>
</template>