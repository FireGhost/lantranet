import z from "zod";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(event, z.object({
    statusId: z.coerce.number().positive(),
  }).parse);

  await usePrisma().orderStatus.delete({
    where: {
      id: params.statusId,
    }
  });
});