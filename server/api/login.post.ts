export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, UserLoginSchema.parse);
  
  const user = await usePrisma().user.findUnique({
    where: {
      username: body.username,
    }
  });
  if (!user) {
    throw createError('Bad credentials');
  }

  if (await verifyPassword(user.passwordHash, body.password.concat(user.salt))) {
    await setUserSession(event, {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
    return {};
  }
  else {
    throw createError('Bad credentials');
  }
});
