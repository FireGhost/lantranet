import z from "zod";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(event, z.object({
    lanDayId: z.coerce.number().positive(),
  }).parse);
  
  await usePrisma().lanDay.delete({
    where: {
      id: params.lanDayId,
    }
  });
});