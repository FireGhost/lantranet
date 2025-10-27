import z from "zod";
import { LanDayUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(event, z.object({
    lanDayId: z.coerce.number().positive(),
  }).parse);
  
  const body = await readBody<LanDayUpdateInput>(event);

  await usePrisma().lanDay.update({
    data: body,
    where: {
      id: params.lanDayId,
    }
  });
});