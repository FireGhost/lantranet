import { randomBytes } from "crypto";
import z from "zod";
import { Role } from "~~/prisma/generated/prisma/enums";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      userId: z.coerce.number().positive(),
    }).parse,
  );

  const body = await readBody<PasswordChangeInput>(event);

  const { user: loggedInUser } = await getUserSession(event);

  if (loggedInUser?.role !== Role.ADMIN) {
    const fullUser = await usePrisma().user.findFirst({
      select: {
        id: true,
        username: true,
        role: true,
        passwordHash: true,
        salt: true,
      },
      where: {
        id: params.userId,
      },
    });
    if (!fullUser) {
      throw createError('User not found');
    }

    if (await verifyPassword(fullUser.passwordHash, body.currentPassword.concat(fullUser.salt)) !== true) {
      throw createError('Wrong current password');
    }
  }

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = await hashPassword(body.newPassword.concat(salt));

  await usePrisma().user.update({
    data: {
      passwordHash: hashedPassword,
      salt: salt,
    },
    where: {
      id: params.userId
    }
  });
});
