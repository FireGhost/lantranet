import z from "zod";
import type { OrderUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      orderId: z.coerce.number().positive(),
    }).parse,
  );

  const body = await readBody<OrderUpdateInput>(event);

  await usePrisma().order.update({
    data: body,
    where: {
      id: params.orderId,
    },
  });
});
