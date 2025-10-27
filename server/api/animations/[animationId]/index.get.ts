import z from "zod";
import type { AnimationInclude } from "~~/prisma/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    z.object({
      animationId: z.coerce.number().positive(),
    }).parse,
  );

  const query = getQuery(event);

  const includeData: AnimationInclude = {};

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
          },
        },
      },
    };
  }

  return await usePrisma().animation.findFirst({
    where: {
      id: params.animationId,
    },
    include: includeData,
  });
});
