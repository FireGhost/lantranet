-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayersTeams" (
    "teamId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    PRIMARY KEY ("teamId", "playerId"),
    CONSTRAINT "PlayersTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayersTeams_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayersTeams" ("playerId", "teamId") SELECT "playerId", "teamId" FROM "PlayersTeams";
DROP TABLE "PlayersTeams";
ALTER TABLE "new_PlayersTeams" RENAME TO "PlayersTeams";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
