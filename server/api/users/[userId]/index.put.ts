import z from "zod";
import type { UserUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      userId: z.coerce.number().positive(),
    }).parse,
  );

  const body = await readBody<UserUpdateInput>(event);

  if (body.username && await usePrisma().user.findByUsernameCI(body.username.toString())) {
    throw createError("Username already exists");
  }

  await usePrisma().user.update({
    data: body,
    where: {
      id: params.userId,
    },
  });

  const { user: currentUser } = await getUserSession(event);
  if (currentUser?.id === params.userId) {
    await setUserSession(event, {
      user: {
        username: body.username,
        role: body.role,
      },
    });
  }
});
