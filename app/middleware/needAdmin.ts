import { Role } from "~~/prisma/generated/prisma/enums";

export default defineNuxtRouteMiddleware(async () => {
  const { user } = useUserSession();
  if (user.value?.role !== Role.ADMIN) {
    showError({
      statusMessage: 'You are not authorized to access this page.',
      statusCode: 401,
    });
  }
});
