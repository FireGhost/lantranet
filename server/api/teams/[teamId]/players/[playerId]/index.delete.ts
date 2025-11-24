import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      teamId: z.coerce.number().positive(),
      playerId: z.coerce.number().positive(),
    }).parse,
  );

  const { user } = await getUserSession(event);
  if (!isAdmin(event) && user?.id !== params.playerId) {
    throw createError({
      message: "Not authorized",
      statusCode: 401,
    });
  }

  await usePrisma().playersTeams.delete({
    where: {
      teamId_playerId: {
        playerId: params.playerId,
        teamId: params.teamId,
      },
    },
  });
});
