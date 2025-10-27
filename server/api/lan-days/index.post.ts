import type { LanDayCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const body = await readBody<LanDayCreateInput>(event);

  await usePrisma().lanDay.create({
    data: body,
  });
});