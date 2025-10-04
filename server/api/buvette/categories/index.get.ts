import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const menuCategoryInclude: Prisma.MenuCategoryInclude = {};

  if (query.withMenuItems) {
    menuCategoryInclude.menuItems = true;
  }

  return usePrisma().menuCategory.findMany({
    include: menuCategoryInclude,
  });
});
