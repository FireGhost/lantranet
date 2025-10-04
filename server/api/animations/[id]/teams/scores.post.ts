export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const animationId = getRouterParam(event, 'id');
  if (!animationId) {
    throw createError('Animation ID not found in URL');
  }

  const body = await readBody<TeamScorePost[]>(event);

  body.forEach(async (teamScore) => {
    await usePrisma().team.updateMany({
      data: {
        score: teamScore.score,
      },
      where: {
        id: teamScore.teamId,
      },
    });
  });
});
