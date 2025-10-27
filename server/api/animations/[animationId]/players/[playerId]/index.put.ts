import z from "zod";
import { AnimationsPlayersUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    animationId: z.coerce.number().positive(),
    playerId: z.coerce.number().positive(),
  }).parse);

  const body = await readBody<AnimationsPlayersUpdateInput>(event);

  await usePrisma().animationsPlayers.update({
    data: body,
    where: {
      playerId_animationId: {
        animationId: params.animationId,
        playerId: params.playerId,
      }
    }
  });
});