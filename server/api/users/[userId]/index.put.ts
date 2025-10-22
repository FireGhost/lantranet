import z from "zod";
import { UserUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    userId: z.coerce.number().positive(),
  }).parse);

  const body = readBody<UserUpdateInput>(event);

  return await usePrisma().user.update({
    data: body,
    where: {
      id: params.userId,
    }
  });
});