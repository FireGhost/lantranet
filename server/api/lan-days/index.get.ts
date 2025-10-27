import type { LanDayInclude } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const lanDayIncludes: LanDayInclude = {};
  if (query.includeAnimations) {
    lanDayIncludes.animations = true;
  }

  return usePrisma().lanDay.findMany({
    include: lanDayIncludes,
  });
});