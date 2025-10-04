export default defineEventHandler(async (event) => {
  const teamId = getRouterParam(event, 'team_id');
  if (!teamId) {
    throw createError('Missing team ID in route');
  }

  const session = await getUserSession(event);
  if (!session.user) {
    throw createError('Missing session. Logout and login again.');
  }

  const body = await readBody<SubscribePost>(event);
  if (!body) {
    throw createError('Missing body.');
  }

  if (body.subscribe) {
    return usePrisma().playersTeams.create({
      data: {
        playerId: session.user.id,
        teamId: Number.parseInt(teamId),
      }
    });
  }
  else {
    return usePrisma().playersTeams.delete({
      where: {
        teamId_playerId: {
          playerId: session.user.id,
          teamId: Number.parseInt(teamId),
        }
      }
    });
  }
});
