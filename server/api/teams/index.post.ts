import type { TeamCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<TeamCreateInput>(event);

  if (body.score !== null && body.score !== undefined) {
    await needAdmin(event);
  }

  await usePrisma().team.create({
    data: body,
  });
});
