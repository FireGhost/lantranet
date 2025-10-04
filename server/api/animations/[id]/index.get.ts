import { Prisma } from "@prisma/client";

export default defineEventHandler((event) => {
  const animationId = Number.parseInt(getRouterParam(event, 'id') ?? '');
  const query = getQuery(event);
  const includeData: Prisma.AnimationInclude = {};
  if (query.withAdminUser) {
    includeData.adminUser = true;
  }
  if (query.withLanDay) {
    includeData.lanDay = true;
  }
  if (query.withPlayers) {
    includeData.players = {
      include: {
        player: true,
      },
    };
  }
  if (query.withTeams) {
    includeData.teams = {
      include: {
        players: {
          include: {
            player: true,
          }
        }
      }
    }
  }
  return usePrisma().animation.findFirst({
    where: {
      id: animationId,
    },
    include: includeData,
  });
});
