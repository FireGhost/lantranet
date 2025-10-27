import { PlayersTeamsCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<PlayersTeamsCreateInput>(event);

  await usePrisma().playersTeams.create({
    data: body,
  });
});