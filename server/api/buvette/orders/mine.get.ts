import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError('User not logged in.');
  }

  const query = getQuery(event);
  const ordersIncludes: Prisma.OrderInclude = {};

  if (query.withOrderItems) {
    ordersIncludes.orderItems = true;
  }

  if (query.withStatus) {
    ordersIncludes.status = true;
  }

  return usePrisma().order.findMany({
    where: {
      userId: session.user.id,
    },
    include: ordersIncludes,
  });
});
