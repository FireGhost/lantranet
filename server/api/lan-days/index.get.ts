import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const findArgs: Prisma.LanDayFindManyArgs = {};
  if (query.includeAnimations) {
    findArgs.include = {
      animations: true,
    };
  }
  return usePrisma().lanDay.findMany(findArgs);
});
