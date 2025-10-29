import type { UserInclude } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const userInclude: UserInclude = {};

  if (query.withAnimationsAsPlayer) {
    userInclude.animationsAsPlayer = {
      include: {
        animation: true,
      },
    };
  }
  if (query.withTeams) {
    userInclude.teams = {
      include: {
        team: {
          include: {
            animation: true,
          },
        },
      },
    };
  }

  return usePrisma().user.findMany({
    include: userInclude,
    omit: {
      passwordHash: true,
      salt: true,
    }
  });
});
