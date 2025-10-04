export default defineEventHandler(async (event) => {
  return usePrisma().user.findMany({
    include: {
      animationsAsPlayer: {
        include: {
          animation: true
        }
      },
      teams: {
        include: {
          team: {
            include : {
              animation: true
            }
          }
        }
      }
    },
  });
});
