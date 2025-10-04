export default defineEventHandler(async (event) => {
  return usePrisma().user.findMany()
});
