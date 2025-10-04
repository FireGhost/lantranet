export default defineEventHandler(async (event) => {
  const userSession = await getUserSession(event);
  if (!userSession.user) {
    throw createError('User not logged in');
  }

  const animationId = Number.parseInt(getRouterParam(event, 'id') ?? '-1');
  const body = await readBody<SubscribePost>(event);
  if (body.subscribe) {
    return usePrisma().animationsPlayers.create({
      data: {
        animationId: animationId,
        playerId: userSession.user.id,
      }
    });
  }
  else {
    return usePrisma().animationsPlayers.delete({
      where: {
        playerId_animationId: {
          animationId: animationId,
          playerId: userSession.user.id,
        }
      }
    })
  }
});
