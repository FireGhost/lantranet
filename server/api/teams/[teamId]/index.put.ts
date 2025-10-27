import z from "zod";
import type { TeamUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    teamId: z.coerce.number().positive(),
  }).parse);

  const body = await readBody<TeamUpdateInput>(event);

  await usePrisma().team.update({
    data: body,
    where: {
      id: params.teamId,
    }
  });
});