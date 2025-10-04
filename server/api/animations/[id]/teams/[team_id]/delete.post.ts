export default defineEventHandler(async (event) => {
  const teamId = getRouterParam(event, 'team_id');
  if (!teamId) {
    throw createError('Missing team ID in route');
  }

  return usePrisma().team.delete({
    where: {
      id: Number.parseInt(teamId)
    }
  });
});
