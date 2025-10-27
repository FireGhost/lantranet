import { MenuCategoryInclude, MenuCategoryOrderByWithRelationInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  const menuCategoryInclude: MenuCategoryInclude = {};
  if (query.withMenuItems) {
    menuCategoryInclude.menuItems = true;
  }

  const orderBy: MenuCategoryOrderByWithRelationInput = {};
  if (query.orderByWeight) {
    orderBy.weight = "asc";
  }

  return await usePrisma().menuCategory.findMany({
    include: menuCategoryInclude,
    orderBy: orderBy,
  });
});
