import z from "zod";
import type { MenuCategoryUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(event, z.object({
    categoryId: z.coerce.number().positive(),
  }).parse);

  const body = await readBody<MenuCategoryUpdateInput>(event);

  await usePrisma().menuCategory.update({
    data: body,
    where: {
      id: params.categoryId,
    }
  });
});
