import { LanDayModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const body = await readBody<LanDayModel>(event);
  return usePrisma().lanDay.delete({
    where: {
      id: body.id,
    }
  })
});
