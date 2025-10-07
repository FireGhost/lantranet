import type { AnimationModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<AnimationModel>(event);
  return usePrisma().animation.create({
    data: body
  });
});
