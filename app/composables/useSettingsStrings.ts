import type { SettingsStringsCreateInput } from "~~/prisma/generated/prisma/models";

type settingStringKey = 
  "app-name"
  |"app-datetime-locale"
  |"app-currency-suffix"
  |"app-locale"
  |"homepage-title"
  |"homepage-content";

export const useSettingsStrings = () => {
  const { t } = useI18n();
  
  return {
    get: async (key: settingStringKey) => {
      const { data } = await useFetch(`/api/settings-strings/${key}`);
      return data.value?.value ?? '';
    },
    upsert: (key: settingStringKey, value: string) => {
      useApi("/api/settings-strings", {
        fetchOptions: {
          method: 'POST',
          body: {
            key: key,
            value: value,
          } satisfies SettingsStringsCreateInput,
        },
        successString: t('String updated'),
      });
    }
  }
};
