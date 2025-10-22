import { MenuCategoryInclude } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  const menuCategoryInclude: MenuCategoryInclude = {};

  if (query.withMenuItems) {
    menuCategoryInclude.menuItems = true;
  }

  return usePrisma().menuCategory.findMany({
    include: menuCategoryInclude,
  });
});
