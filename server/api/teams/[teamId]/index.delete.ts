import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      teamId: z.coerce.number().positive(),
    }).parse,
  );

  // TODO: Check that the user is admin or in the team that will be deleted.

  await usePrisma().team.delete({
    where: {
      id: params.teamId,
    },
  });
});
