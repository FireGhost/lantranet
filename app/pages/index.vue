<script setup lang="ts">
useHead({
  title: "Home",
});

const settingsStrings = useSettingsStrings();

const homepageTitle = await settingsStrings.get('homepage-title');
const homepageContent = await settingsStrings.get('homepage-content');
</script>

<template>
  <UPageHero
    :title="homepageTitle"
    :description="homepageContent"
    class="whitespace-pre-wrap"
  />
</template>
