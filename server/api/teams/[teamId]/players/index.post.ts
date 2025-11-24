import type { PlayersTeamsCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<PlayersTeamsCreateInput>(event);

  const { user } = await getUserSession(event);
  if (!isAdmin(event) && user?.id !== body.player.connect?.id) {
    throw createError({
      message: "Not authorized",
      statusCode: 401,
    });
  }

  await usePrisma().playersTeams.create({
    data: body,
  });
});
