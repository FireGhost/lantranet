export default defineEventHandler(async (event) => {
  await needAdmin(event);

  const body = await readBody<{id: number}>(event);
  await usePrisma().orderStatus.delete({
    where: {
      id: body.id,
    }
  });
});
