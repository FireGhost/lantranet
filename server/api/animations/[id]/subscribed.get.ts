export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError('No user session');
  }

  const animationId = getRouterParam(event, 'id');
  if (!animationId) {
    throw createError('No animation ID found in URL');
  }

  return usePrisma().animationsPlayers.count({
    where: {
      AND: {
        animationId: Number.parseInt(animationId),
        player: {
          username: session.user.username,
        }
      }
    }
  })
});
