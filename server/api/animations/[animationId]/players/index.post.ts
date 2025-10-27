import type { AnimationsPlayersCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<AnimationsPlayersCreateInput>(event);

  await usePrisma().animationsPlayers.create({
    data: body,
  });
});
