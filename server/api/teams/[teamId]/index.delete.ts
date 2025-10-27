import z from "zod";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      teamId: z.coerce.number().positive(),
    }).parse,
  );

  await usePrisma().team.delete({
    where: {
      id: params.teamId,
    },
  });
});
