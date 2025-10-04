import type { Team } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const teamId = getRouterParam(event, 'team_id');
  if (!teamId) {
    throw createError('Missing team ID in route');
  }

  const body = await readBody<Partial<Team>>(event);
  body.id = undefined;
  return usePrisma().team.update({
    data: body,
    where: {
      id: Number.parseInt(teamId),
    }
  })
});
