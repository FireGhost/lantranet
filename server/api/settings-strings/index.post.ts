import type { SettingsStringsCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<SettingsStringsCreateInput>(event);
  await usePrisma().settingsStrings.upsert({
    create: body,
    update: {
      value: body.value,
    },
    where: {
      key: body.key
    }
  });
});
