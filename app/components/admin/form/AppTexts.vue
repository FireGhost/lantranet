<script setup lang="ts">
const settingsStrings = useSettingsStrings();

const appName = ref(await settingsStrings.get('app-name'));

function saveAppTexts() {
  settingsStrings.upsert('app-name', appName.value);
}
</script>

<template>
  <UForm @submit="saveAppTexts">
    <UFormField>
      <UFieldGroup>
        <UInput v-model="appName" placeholder="App name" class="w-60" />
        <UButton type="submit" icon="i-lucide-save" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>
