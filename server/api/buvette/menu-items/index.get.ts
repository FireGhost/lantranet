export default defineEventHandler(async (event) => {
  return await usePrisma().menuItem.findMany();
});
