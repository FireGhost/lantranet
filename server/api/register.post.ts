import { Role } from "@prisma/client";
import { randomBytes } from "crypto";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, UserLoginSchema.parse);
  
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = await hashPassword(body.password.concat(salt));

  // First person to register become admin.
  const usersCount = await usePrisma().user.count();
  let role: Role = Role.USER;
  if (usersCount === 0) {
    role = Role.ADMIN;
  }

  const user = await usePrisma().user.create({
    data: {
      username: body.username,
      passwordHash: hashedPassword,
      salt: salt,
      role: role,
    }
  });

  await setUserSession(event, {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
  return {};
});
