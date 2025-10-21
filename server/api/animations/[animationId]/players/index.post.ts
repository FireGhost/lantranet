import z from "zod";
import { AnimationsPlayersUncheckedCreateWithoutAnimationInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    animationId: z.coerce.number().positive()
  }).parse);

  const body = await readBody<AnimationsPlayersUncheckedCreateWithoutAnimationInput>(event);

  return await usePrisma().animationsPlayers.create({
    data: {
      ...body,
      animationId: params.animationId,
    }
  })
});
