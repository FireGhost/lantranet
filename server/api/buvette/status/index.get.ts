import type { OrderStatusOrderByWithRelationInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const orderBy: OrderStatusOrderByWithRelationInput = {};
  if (query.orderByWeight) {
    orderBy.weight = "asc";
  }

  return usePrisma().orderStatus.findMany({
    orderBy: orderBy,
  });
});
