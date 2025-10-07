import { Role } from "~~/prisma/generated/prisma/enums";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  return session.user?.role === Role.ADMIN;
});
