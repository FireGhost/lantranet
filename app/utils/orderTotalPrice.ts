import type { OrderGetPayload } from "~~/prisma/generated/prisma/models";

export const computeTotalPrice = (
  order: OrderGetPayload<{
    include: {
      orderItems: true;
    };
  }>,
) => {
  let total = 0;
  order.orderItems.forEach((orderItem) => {
    total += orderItem.priceAtOrder;
  });
  return total;
};
