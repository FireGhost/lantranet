import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      animationId: z.coerce.number().positive(),
    }).parse,
  );

  return await usePrisma().animationsPlayers.findMany({
    where: {
      animationId: params.animationId,
    },
  });
});
