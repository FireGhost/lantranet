import { LanDayCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const body = await readBody<LanDayCreateInput>(event);

  if (!body.weight) {
    const weight = await usePrisma().lanDay.count();
    body.weight = weight;
  }

  return await usePrisma().lanDay.create({
    data: body,
  });
});