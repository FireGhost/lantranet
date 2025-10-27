export default defineEventHandler(async () => {
  return await usePrisma().team.findMany();
});