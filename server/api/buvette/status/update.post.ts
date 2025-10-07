import { OrderStatusModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<Partial<OrderStatusModel>>(event);
  const orderStatusId = body.id;
  body.id = undefined;
  await usePrisma().orderStatus.update({
    data: body,
    where: {
      id: orderStatusId,
    }
  });
});
