import { Animation } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const body = await readBody<Partial<Animation>>(event);
  const animationId = body.id;
  body.id = undefined;
  return usePrisma().animation.update({
    data: body,
    where: {
      id: animationId,
    },
  });
});
