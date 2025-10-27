import type { OrderStatusCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<OrderStatusCreateInput>(event);

  await usePrisma().orderStatus.create({
    data: body,
  });
});