import { TeamCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<TeamCreateInput>(event);

  await usePrisma().team.create({
    data: body,
  });
});