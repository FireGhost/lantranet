import z from "zod";
import type { MenuItemUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      menuItemId: z.coerce.number().positive(),
    }).parse,
  );

  const body = await readBody<MenuItemUpdateInput>(event);

  await usePrisma().menuItem.update({
    data: body,
    where: {
      id: params.menuItemId,
    },
  });
});
