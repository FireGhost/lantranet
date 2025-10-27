import type { LanDayInclude, LanDayOrderByWithRelationInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const lanDayIncludes: LanDayInclude = {};
  if (query.includeAnimations) {
    lanDayIncludes.animations = true;
  }

  const orderBy: LanDayOrderByWithRelationInput = {};
  if (query.orderByWeight) {
    orderBy.weight = 'asc';

    if (query.includeAnimations) {
      lanDayIncludes.animations = {
        orderBy: {
          weight: 'asc',
        }
      };
    }
  }

  return usePrisma().lanDay.findMany({
    include: lanDayIncludes,
    orderBy: {
      weight: 'asc',
    },
  });
});