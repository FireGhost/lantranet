<script setup lang="ts">
defineProps<{
  title: string,
}>();
</script>

<template>
  <div class="text-3xl font-bold mt-4">
    {{ title }}
  </div>
  <USeparator class="mt-2 mb-2" />
  <div class="flex pt-4 gap-4 flex-wrap">
    <slot />
  </div>
</template>
