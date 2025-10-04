import { Animation } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<Animation>(event);
  return usePrisma().animation.create({
    data: body
  });
});
