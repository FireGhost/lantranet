import z from "zod";
import type { AnimationUpdateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const params = await getValidatedRouterParams(
    event,
    z.object({
      animationId: z.coerce.number().positive(),
    }).parse,
  );

  const body = await readBody<AnimationUpdateInput>(event);

  await usePrisma().animation.update({
    data: body,
    where: {
      id: params.animationId,
    },
  });
});
