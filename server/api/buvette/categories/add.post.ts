import { MenuCategoryModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<MenuCategoryModel>(event);
  await usePrisma().menuCategory.create({
    data: body,
  });
});
