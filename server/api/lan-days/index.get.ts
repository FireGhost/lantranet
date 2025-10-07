import { LanDayFindManyArgs } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const findArgs: LanDayFindManyArgs = {};
  if (query.includeAnimations) {
    findArgs.include = {
      animations: true,
    };
  }
  return usePrisma().lanDay.findMany(findArgs);
});
