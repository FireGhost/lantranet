<script setup lang="ts">
useHead({
  title: 'New animation',
});

definePageMeta({
  layout: 'animations',
  middleware: "need-admin",
});
</script>

<template>
  <FormAnimation :animation="{}" />
</template>
