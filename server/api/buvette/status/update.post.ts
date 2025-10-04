import { OrderStatus } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<Partial<OrderStatus>>(event);
  const orderStatusId = body.id;
  body.id = undefined;
  await usePrisma().orderStatus.update({
    data: body,
    where: {
      id: orderStatusId,
    }
  });
});
