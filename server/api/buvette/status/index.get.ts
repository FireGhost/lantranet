export default defineEventHandler(async (event) => {
  return usePrisma().orderStatus.findMany();
});
