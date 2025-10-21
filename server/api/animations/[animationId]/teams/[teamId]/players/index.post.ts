import z from "zod";
import { PlayersTeamsUncheckedCreateWithoutTeamInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    animationId: z.coerce.number().positive(),
    teamId: z.coerce.number().positive(),
  }).parse);

  const body = await readBody<PlayersTeamsUncheckedCreateWithoutTeamInput>(event);

  return await usePrisma().playersTeams.create({
    data: {
      ...body,
      teamId: params.teamId,
    }
  });
});