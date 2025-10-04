export default defineEventHandler(async (event) => {
  await needAdmin(event);
  
  const body = await readValidatedBody(event, NewLanDaySchema.parse);
  const weight = await usePrisma().lanDay.count();
  return usePrisma().lanDay.create({
    data: {
      name: body.name,
      weight: weight,
    }
  })
});
