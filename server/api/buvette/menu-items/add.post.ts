import { MenuItemModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<MenuItemModel>(event);
  await usePrisma().menuItem.create({
    data: body
  });
});
