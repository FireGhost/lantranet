import { MenuCategoryModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<Partial<MenuCategoryModel>>(event);
  const menuCategoryId = body.id;
  body.id = undefined;
  await usePrisma().menuCategory.update({
    data: body,
    where: {
      id: menuCategoryId,
    }
  });
});
