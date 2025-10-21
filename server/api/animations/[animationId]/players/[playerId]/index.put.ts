import z from "zod";
import { AnimationsPlayersUpdateManyMutationInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    animationId: z.coerce.number().positive(),
    playerId: z.coerce.number().positive(),
  }).parse);

  const body = await readBody<AnimationsPlayersUpdateManyMutationInput>(event);

  return await usePrisma().animationsPlayers.update({
    data: body,
    where: {
      playerId_animationId: {
        animationId: params.animationId,
        playerId: params.playerId,
      }
    }
  });
});
