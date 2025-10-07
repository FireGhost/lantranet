import { OrderStatusModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<OrderStatusModel>(event);

  await usePrisma().orderStatus.create({
    data: body,
  });
});
