import type { EventHandlerRequest, H3Event } from "h3";
import { Role } from "~~/prisma/generated/prisma/enums";

export const needAdmin = async (event: H3Event<EventHandlerRequest>) => {
  if (await isAdmin(event) === false) {
    throw createError({
      message: "Admin role is needed !",
      statusCode: 401,
    });
  }
};

export const isAdmin = async (event: H3Event<EventHandlerRequest>) => {
  const session = await getUserSession(event);
  return session.user?.role === Role.ADMIN
};
