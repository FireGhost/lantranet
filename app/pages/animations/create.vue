<script setup lang="ts">
definePageMeta({
  layout: 'animations',
  middleware: "need-admin",
});
</script>

<template>
  <FormAnimation :animation="{}" />
</template>
