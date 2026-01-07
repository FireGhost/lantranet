import z from "zod";
import type { TeamUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      teamId: z.coerce.number().positive(),
    }).parse,
  );

  const body = await readBody<TeamUpdateInput>(event);
  
  const session = await getUserSession(event);

  const playerIsInTeam = await usePrisma().playersTeams.count({
    where: {
      playerId: session.user?.id,
      teamId: params.teamId
    }
  });

  if (body.score !== null && body.score !== undefined) {
    await needAdmin(event);
  }
  else if (!playerIsInTeam) {
    await needAdmin(event);
  }

  await usePrisma().team.update({
    data: body,
    where: {
      id: params.teamId,
    },
  });
});
