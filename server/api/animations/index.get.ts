export default defineEventHandler(async (event) => {
  return await usePrisma().animation.findMany();
});
