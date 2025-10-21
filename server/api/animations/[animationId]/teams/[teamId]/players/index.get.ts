import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    animationId: z.coerce.number().positive(),
    teamId: z.coerce.number().positive()
  }).parse);

  return await usePrisma().playersTeams.findMany({
    where: {
      teamId: params.teamId,
    }
  });
});