import { PrismaClient } from "~~/prisma/generated/prisma/client";

const prisma = new PrismaClient({
  // Omit will remove the fields for all queries, unless they are specificaly targeted with a "select".
  omit: {
    user: {
      passwordHash: true,
      salt: true,
    }
  }
}).$extends({
  name: 'usernameLowercase',
  result: {
    user: {
      usernameLowercase: {
        needs: { username: true },
        compute: (user) => {
          return user.username.toLowerCase()
        }
      }
    }
  },
  model: {
    user: {
      async findByUsernameCI(usernameToFind: string) {
        const users = await prisma.user.findMany();
        return users.find((value) => usernameToFind.toLowerCase() === value.usernameLowercase) ?? false;
      }
    }
  },
});

export const usePrisma = () => prisma;
