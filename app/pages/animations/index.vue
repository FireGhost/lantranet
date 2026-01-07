<script setup lang="ts">
useHead({
  title: $t("Animations"),
});

definePageMeta({
  layout: "animations",
});
</script>

<template>
  <UPageHeader
    :title="$t('Choose an animation')"
    :description="$t('<- here, on the left')"
  />
</template>
