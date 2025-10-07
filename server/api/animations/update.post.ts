import { AnimationModel } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const body = await readBody<Partial<AnimationModel>>(event);
  const animationId = body.id;
  body.id = undefined;
  return usePrisma().animation.update({
    data: body,
    where: {
      id: animationId,
    },
  });
});
