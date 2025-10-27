export default defineEventHandler(async () => {
  return await usePrisma().animation.findMany();
});