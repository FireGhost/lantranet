import { OrderModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<Partial<OrderModel>>(event);
  const orderId = body.id;
  body.id = undefined;

  await usePrisma().order.update({
    data: {
      createdAt: body.createdAt,
      statusId: body.statusId,
      userId: body.userId,
    },
    where: {
      id: orderId,
    }
  });
});
