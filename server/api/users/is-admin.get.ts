import { Role } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  return session.user?.role === Role.ADMIN;
});
