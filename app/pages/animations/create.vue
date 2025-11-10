<script setup lang="ts">
useHead({
  title: $t("New animation"),
});

definePageMeta({
  layout: "animations",
  middleware: "need-admin",
});
</script>

<template>
  <FormAnimation :animation="{}" />
</template>
