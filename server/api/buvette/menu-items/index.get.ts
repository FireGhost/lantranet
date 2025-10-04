export default defineEventHandler(async (event) => {
  return usePrisma().menuItem.findMany();
});
