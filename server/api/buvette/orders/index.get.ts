import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const orderIncludes: Prisma.OrderInclude = {};
  if (query.withUser) {
    orderIncludes.user = true;
  }
  if (query.withStatus) {
    orderIncludes.status = true;
  }
  if (query.withOrderItems) {
    orderIncludes.orderItems = true;
  }
  
  return usePrisma().order.findMany({
    include: orderIncludes,
  });
});
