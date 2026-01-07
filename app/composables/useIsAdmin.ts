import { Role } from "~~/prisma/generated/prisma/enums";

export const useIsAdmin = () => {
  const { user } = useUserSession();
  return user.value?.role === Role.ADMIN;
};
