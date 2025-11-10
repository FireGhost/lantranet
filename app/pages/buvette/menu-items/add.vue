<script setup lang="ts">
useHead({
  title: $t("New menu item"),
});

definePageMeta({
  layout: "buvette",
  middleware: "need-admin",
});
</script>

<template>
  <FormMenuItem :menu-item="{}" />
</template>
