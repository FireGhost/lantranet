import type { AnimationCreateManyInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<AnimationCreateManyInput>(event);
  
  await usePrisma().animation.create({
    data: body
  });
});