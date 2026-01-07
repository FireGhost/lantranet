import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      teamId: z.coerce.number().positive(),
    }).parse,
  );

  const session = await getUserSession(event);

  const playerIsInTeam = await usePrisma().playersTeams.count({
    where: {
      playerId: session.user?.id,
      teamId: params.teamId
    }
  });

  if (!playerIsInTeam) {
    await needAdmin(event);
  }

  await usePrisma().team.delete({
    where: {
      id: params.teamId,
    },
  });
});
