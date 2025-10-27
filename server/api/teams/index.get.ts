export default defineEventHandler(async (event) => {
  return await usePrisma().team.findMany();
});