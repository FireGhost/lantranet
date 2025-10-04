import { Role } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const userId = getRouterParam(event, 'id');
  if (!userId) {
    throw createError('No user ID provided');
  }

  const user = await usePrisma().user.findUnique({
    where: {
      id: Number.parseInt(userId),
    }
  });
  if (!user) {
    throw createError('No user found with this ID');
  }

  return usePrisma().user.update({
    data: {
      role: user.role === Role.USER ? Role.ADMIN : Role.USER,
    },
    where: {
      id: user.id,
    }
  });
});
