import type { SettingsStringsCreateInput } from "~~/prisma/generated/prisma/models";

export const useSettingsStrings = () => {
  return {
    get: async (key: string) => {
      const { data } = await useFetch(`/api/settings-strings/${key}`);
      return data.value?.value ?? '';
    },
    upsert: (key: string, value: string) => {
      useApi("/api/settings-strings", {
        fetchOptions: {
          method: 'POST',
          body: {
            key: key,
            value: value,
          } satisfies SettingsStringsCreateInput,
        },
        successString: 'String updated',
      });
    }
  }
};
