import type { TeamCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<TeamCreateInput>(event);

  if (body.score && !isAdmin(event)) {
    throw createError({
      message: "Not authorized",
      statusCode: 401,
    });
  }

  await usePrisma().team.create({
    data: body,
  });
});
