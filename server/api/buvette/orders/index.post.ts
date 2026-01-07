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

  const { user } = await getUserSession(event);

  if (user?.id !== body.user.connect?.id) {
    await needAdmin(event);
  }

  await usePrisma().order.create({
    data: body,
  });
});
