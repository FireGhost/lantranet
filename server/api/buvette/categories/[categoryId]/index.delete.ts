import z from "zod";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(event, z.object({
    categoryId: z.coerce.number().positive(),
  }).parse);

  await usePrisma().menuCategory.delete({
    where: {
      id: params.categoryId,
    }
  });
});
