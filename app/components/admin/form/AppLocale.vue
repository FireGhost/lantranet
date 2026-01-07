<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";
import type { Locale } from "vue-i18n";

const settingsStrings = useSettingsStrings();
const { locales } = useI18n();

const selectedLocale = ref(await settingsStrings.get("app-locale"));
const localeSelectItems = computed(() => {
  return locales.value.map((locale) => {
    return {
      label: locale.name,
      value: locale.code,
    } satisfies SelectItem;
  });
});

const currencySuffix = ref(await settingsStrings.get("app-currency-suffix"));
const datetimeLocale = ref(await settingsStrings.get("app-datetime-locale"));

function saveAppLocale() {
  settingsStrings.upsert("app-locale", selectedLocale.value);
}

function saveCurrencySuffix() {
  settingsStrings.upsert("app-currency-suffix", currencySuffix.value);
}

function saveDatetimeLocale() {
  settingsStrings.upsert("app-datetime-locale", datetimeLocale.value);
}
</script>

<template>
  <UForm @submit="saveAppLocale">
    <UFieldGroup>
      <USelect
        v-model="selectedLocale as Locale"
        :items="localeSelectItems"
        class="w-40"
      />
      <UButton type="submit" icon="i-lucide-save" />
    </UFieldGroup>
  </UForm>

  <UForm class="mt-4" @submit="saveCurrencySuffix">
    <UFieldGroup>
      <UInput
        v-model="currencySuffix"
        :placeholder="$t('Currency suffix')"
        class="w-40"
      />
      <UButton type="submit" icon="i-lucide-save" />
    </UFieldGroup>
  </UForm>

  <UForm class="mt-4" @submit="saveDatetimeLocale">
    <UFieldGroup>
      <UInput
        v-model="datetimeLocale"
        :placeholder="$t('Datetime locale')"
        class="w-40"
      />
      <UButton type="submit" icon="i-lucide-save" />
    </UFieldGroup>
  </UForm>
</template>
