import type { PlayersTeamsCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<PlayersTeamsCreateInput>(event);

  const { user } = await getUserSession(event);
  if (user?.id !== body.player.connect?.id) {
    await needAdmin(event);
  }

  await usePrisma().playersTeams.create({
    data: body,
  });
});
