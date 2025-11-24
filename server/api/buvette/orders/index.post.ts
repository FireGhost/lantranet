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

  if (!isAdmin(event) && user?.id !== body.user.connect?.id) {
    throw createError({
      message: "Not authorized",
      statusCode: 401,
    });
  }

  await usePrisma().order.create({
    data: body,
  });
});
