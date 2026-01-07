import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      animationId: z.coerce.number().positive(),
      playerId: z.coerce.number().positive(),
    }).parse,
  );

  const { user } = await getUserSession(event);

  if (user?.id !== params.playerId) {
    await needAdmin(event);
  }

  await usePrisma().animationsPlayers.delete({
    where: {
      playerId_animationId: {
        animationId: params.animationId,
        playerId: params.playerId,
      },
    },
  });
});
