import { MenuItem } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<Partial<MenuItem>>(event);
  const menuItemId = body.id;
  body.id = undefined;
  await usePrisma().menuItem.update({
    data: body,
    where: {
      id: menuItemId,
    },
  });
});
