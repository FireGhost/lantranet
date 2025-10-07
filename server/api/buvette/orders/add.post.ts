import type { OrdersItemsCreateManyOrderInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<CartItem[]>(event);

  const session = await getUserSession(event);
  if (!session.user) {
    throw createError('No user logged in.');
  }

  const ordersInput: OrdersItemsCreateManyOrderInput[] = body.map((orderItem) => {
    return {
      itemId: orderItem.menuItemId,
      nameAtOrder: orderItem.name,
      priceAtOrder: orderItem.price,
      comment: orderItem.comment,
    };
  });

  const firstStatus = await usePrisma().orderStatus.findFirst({
    orderBy: {
      weight: 'asc',
    }
  });

  await usePrisma().order.create({
    data: {
      userId: session.user.id,
      statusId: firstStatus?.id,
      orderItems: {
        createMany: {
          data: ordersInput, 
        }
      }
    }
  })
});
