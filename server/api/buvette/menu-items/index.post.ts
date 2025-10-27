import type { MenuItemCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<MenuItemCreateInput>(event);

  await usePrisma().menuItem.create({
    data: body
  });
});
