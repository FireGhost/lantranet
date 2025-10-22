import { MenuCategoryCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<MenuCategoryCreateInput>(event);

  await usePrisma().menuCategory.create({
    data: body,
  });
});