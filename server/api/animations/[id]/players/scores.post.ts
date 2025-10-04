export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const animationId = getRouterParam(event, 'id');
  if (!animationId) {
    throw createError('Animation ID not found in URL');
  }

  const body = await readBody<PlayerScorePost[]>(event);

  body.forEach(async (playerScore) => {
    await usePrisma().animationsPlayers.updateMany({
      data: {
        score: playerScore.score,
      },
      where: {
        playerId: playerScore.playerId,
        animationId: Number.parseInt(animationId),
      },
    });
  });
});
