import { MenuCategory } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<Partial<MenuCategory>>(event);
  const menuCategoryId = body.id;
  body.id = undefined;
  await usePrisma().menuCategory.update({
    data: body,
    where: {
      id: menuCategoryId,
    }
  });
});
