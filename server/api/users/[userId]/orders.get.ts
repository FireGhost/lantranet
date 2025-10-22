import z from "zod";
import type { OrderInclude } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    userId: z.coerce.number().positive(),
  }).parse);

  const query = getQuery(event);
  const ordersIncludes: OrderInclude = {};

  if (query.withOrderItems) {
    ordersIncludes.orderItems = true;
  }

  if (query.withStatus) {
    ordersIncludes.status = true;
  }

  return await usePrisma().order.findMany({
    include: ordersIncludes,
    where: {
      userId: params.userId,
    }
  });
});