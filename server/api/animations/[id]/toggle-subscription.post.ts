export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const animationId = getRouterParam(event, 'id');
  if (!animationId) {
    throw createError('Animation ID not found in URL');
  }

  const originalValue = await usePrisma().animation.findUnique({
    where: {
      id: Number.parseInt(animationId),
    }
  });
  if (!originalValue) {
    throw createError('Animation not found');
  }

  return usePrisma().animation.update({
    data: {
      openSubscription: !originalValue.openSubscription,
    },
    where: {
      id: Number.parseInt(animationId),
    }
  });
});
