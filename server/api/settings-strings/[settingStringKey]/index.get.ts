import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    settingStringKey: z.string().nonempty(),
  }).parse);

  return await usePrisma().settingsStrings.findFirst({
    where: {
      key: params.settingStringKey,
    },
  });
});
