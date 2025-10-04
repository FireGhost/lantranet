import { MenuCategory } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<MenuCategory>(event);
  await usePrisma().menuCategory.create({
    data: body,
  });
});
