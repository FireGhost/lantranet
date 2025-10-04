import { LanDay } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const body = await readBody<LanDay>(event);
  return usePrisma().lanDay.update({
    where: {
      id: body.id
    },
    data: body
  });
});
