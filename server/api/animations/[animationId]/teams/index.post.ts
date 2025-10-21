import z from "zod";
import { TeamCreateWithoutAnimationInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    animationId: z.coerce.number().positive()
  }).parse);

  const body = await readBody<TeamCreateWithoutAnimationInput>(event);

  return await usePrisma().team.create({
    data: {
      ...body,
      animationId: params.animationId,
    }
  })
});