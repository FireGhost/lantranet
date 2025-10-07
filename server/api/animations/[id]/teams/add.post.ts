import type { TeamCreateInput } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const body = await readBody<TeamCreateInput>(event);
  
  const animationIdParam = getRouterParam(event, 'id');
  if (!animationIdParam) {
    throw createError('No animation ID in url.');
  }
  body.animation = {
    connect: {
      id: Number.parseInt(animationIdParam),
    }
  };

  const session = await getUserSession(event);
  if (!session.user) {
    throw createError('No session. Logout and login again.');
  }
  body.players = {
    create: {
      player: {
        connect: {
          username: session.user.username ?? '',
        }
      }
    }
  };

  return usePrisma().team.create({
    data: body
  });
});
