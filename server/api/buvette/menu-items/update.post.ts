import { MenuItemModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<Partial<MenuItemModel>>(event);
  const menuItemId = body.id;
  body.id = undefined;
  await usePrisma().menuItem.update({
    data: body,
    where: {
      id: menuItemId,
    },
  });
});
