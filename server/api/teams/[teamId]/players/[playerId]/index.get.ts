import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    teamId: z.coerce.number().positive(),
    playerId: z.coerce.number().positive(),
  }).parse);

  return await usePrisma().playersTeams.findUnique({
    where: {
      teamId_playerId: {
        playerId: params.playerId,
        teamId: params.teamId,
      }
    }
  });
});