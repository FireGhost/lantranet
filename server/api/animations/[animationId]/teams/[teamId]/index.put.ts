import z from "zod";
import { TeamUpdateManyMutationInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    animationId: z.coerce.number().positive(),
    teamId: z.coerce.number().positive(),
  }).parse);

  const body = await readBody<TeamUpdateManyMutationInput>(event);

  return await usePrisma().team.update({
    data: body,
    where: {
      id: params.teamId,
      animationId: params.animationId,
    }
  });
});