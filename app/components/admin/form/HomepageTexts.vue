<script setup lang="ts">
const settingsStrings = useSettingsStrings();

const homepageTitle = ref(await settingsStrings.get('homepage-title'));
const homepageContent = ref(await settingsStrings.get('homepage-content'));

function saveHomepageTexts() {
  settingsStrings.upsert('homepage-title', homepageTitle.value);
  settingsStrings.upsert('homepage-content', homepageContent.value);
}
</script>

<template>
  <UForm @submit="saveHomepageTexts">
    <UFormField>
      <UInput v-model="homepageTitle" placeholder="Title text" class="w-60" />
    </UFormField>

    <UFormField class="mt-2">
      <UTextarea v-model="homepageContent" placeholder="Main content" :rows="7" class="w-60" />
    </UFormField>

    <UButton type="submit" label="Save" class="mt-4" />
  </UForm>
</template>
