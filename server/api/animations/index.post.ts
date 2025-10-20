import type { AnimationCreateManyInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<AnimationCreateManyInput>(event);
  return usePrisma().animation.create({
    data: body
  });
});