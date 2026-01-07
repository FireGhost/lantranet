import type { AnimationsPlayersCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<AnimationsPlayersCreateInput>(event);

  const { user } = await getUserSession(event);

  if (body.score !== null && body.score !== undefined) {
    await needAdmin(event);
  }
  else if (user?.id !== body.player.connect?.id) {
    await needAdmin(event);
  }

  await usePrisma().animationsPlayers.create({
    data: body,
  });
});
