export default defineEventHandler(async (event) => {
  const menuItemId = getRouterParam(event, 'id');
  if (!menuItemId) {
    throw createError('No menu item provided in URL');
  }
  
  return usePrisma().menuItem.findUnique({
    where: {
      id: Number.parseInt(menuItemId),
    }
  });
});
