import z from "zod";
import { OrderStatusUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(event, z.object({
    statusId: z.coerce.number().positive(),
  }).parse);

  const body = await readBody<OrderStatusUpdateInput>(event);

  await usePrisma().orderStatus.update({
    data: body,
    where: {
      id: params.statusId,
    }
  });
});