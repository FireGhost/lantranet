import z from "zod";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      menuItemId: z.coerce.number().positive(),
    }).parse,
  );

  await usePrisma().menuItem.delete({
    where: {
      id: params.menuItemId,
    },
  });
});
