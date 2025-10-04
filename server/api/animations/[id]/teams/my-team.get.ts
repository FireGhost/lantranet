export default defineEventHandler(async (event) => {
  const animationId = getRouterParam(event, 'id');
  if (!animationId) {
    throw createError('Missing animation ID in route');
  }

  const session = await getUserSession(event);
  if (!session.user) {
    throw createError('Missing session. Logout and login again.');
  }
  
  return usePrisma().team.findFirst({
    where: {
      animationId: Number.parseInt(animationId),
      players: {
        some: {
          player: {
            username: session.user.username,
          }
        }
      }
    }
  });
});
