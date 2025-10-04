export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<{id: number}>(event);
  await usePrisma().menuCategory.delete({
    where: {
      id: body.id,
    }
  });
});
