import type { OrdersItemsCreateManyOrderInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const ordersInput = await readBody<OrdersItemsCreateManyOrderInput[]>(event);

  const session = await getUserSession(event);
  if (!session.user) {
    throw createError('No user logged in.');
  }

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