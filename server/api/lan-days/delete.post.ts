import { LanDay } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const body = await readBody<LanDay>(event);
  return usePrisma().lanDay.delete({
    where: {
      id: body.id,
    }
  })
});
