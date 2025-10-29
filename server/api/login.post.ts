export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, UserLoginSchema.parse);

  const user = await usePrisma().user.findByUsernameCI(body.username);
  if (!user) {
    throw createError("Bad credentials");
  }

  const fullUser = await usePrisma().user.findFirst({
    select: {
      id: true,
      username: true,
      role: true,
      passwordHash: true,
      salt: true,
    },
    where: {
      id: user.id,
    },
  });
  if (!fullUser) {
    throw createError("Bad credentials");
  }

  if (
    await verifyPassword(
      fullUser.passwordHash,
      body.password.concat(fullUser.salt),
    )
  ) {
    await setUserSession(event, {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } else {
    throw createError("Bad credentials");
  }
});
