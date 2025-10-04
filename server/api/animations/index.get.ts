export default defineEventHandler((event) => {
  return usePrisma().animation.findMany();
});
