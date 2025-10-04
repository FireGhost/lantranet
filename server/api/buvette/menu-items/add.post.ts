import { MenuItem } from "@prisma/client";

export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<MenuItem>(event);
  await usePrisma().menuItem.create({
    data: body
  });
});
