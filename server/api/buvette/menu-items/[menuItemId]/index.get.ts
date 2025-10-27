import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      menuItemId: z.coerce.number().positive(),
    }).parse,
  );

  return await usePrisma().menuItem.findUnique({
    where: {
      id: params.menuItemId,
    },
  });
});
