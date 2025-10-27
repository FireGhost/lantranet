import type { OrderCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<OrderCreateInput>(event);

  if (!body.status) {
    const firstStatus = await usePrisma().orderStatus.findFirst({
      orderBy: {
        weight: "asc",
      },
    });
    if (firstStatus) {
      body.status = {
        connect: {
          id: firstStatus.id,
        },
      };
    }
  }

  await usePrisma().order.create({
    data: body,
  });
});
