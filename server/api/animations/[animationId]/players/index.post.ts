import type { AnimationsPlayersCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<AnimationsPlayersCreateInput>(event);

  const { user } = await getUserSession(event);

  if (body.score) {
    await needAdmin(event);
  }
  else if (user?.id !== body.player.connect?.id && await isAdmin(event)) {
    throw createError({
      message: "Not authorized",
      statusCode: 401,
    });
  }

  await usePrisma().animationsPlayers.create({
    data: body,
  });
});
