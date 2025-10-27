export default defineEventHandler(async () => {
  return await usePrisma().menuItem.findMany();
});
