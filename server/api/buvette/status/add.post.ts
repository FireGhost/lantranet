import { OrderStatus } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<OrderStatus>(event);

  await usePrisma().orderStatus.create({
    data: body,
  });
});
