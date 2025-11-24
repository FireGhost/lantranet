import z from "zod";
import type { TeamUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      teamId: z.coerce.number().positive(),
    }).parse,
  );

  const body = await readBody<TeamUpdateInput>(event);
  
  // TODO: Check that the user is admin or in the team that will be modified.
  // TODO: Check that only the admin can modify the score.

  await usePrisma().team.update({
    data: body,
    where: {
      id: params.teamId,
    },
  });
});
