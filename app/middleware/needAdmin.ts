import { Role } from "@prisma/client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useUserSession();
  if (user.value?.role !== Role.ADMIN) {
    showError({
      statusMessage: 'You are not authorized to access this page.',
      statusCode: 401,
    });
  }
});
