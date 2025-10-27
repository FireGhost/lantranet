import type { EventHandlerRequest, H3Event } from "h3";
import { Role } from "~~/prisma/generated/prisma/enums";

export const needAdmin = async (event: H3Event<EventHandlerRequest>) => {
  const session = await getUserSession(event);
  if (session.user?.role !== Role.ADMIN) {
    throw createError('Admin role is needed !');
  } 
}
