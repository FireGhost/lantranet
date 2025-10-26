import z from "zod";

export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const params = await getValidatedRouterParams(event, z.object({
    animationId: z.coerce.number().positive()
  }).parse);
  
  await usePrisma().animation.delete({
    where: {
      id: params.animationId,
    },
  });
});