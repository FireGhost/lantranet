-- CreateTable
CREATE TABLE "AnimationsPlayers" (
    "playerId" INTEGER NOT NULL,
    "animationId" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "animationId"),
    CONSTRAINT "AnimationsPlayers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AnimationsPlayers_animationId_fkey" FOREIGN KEY ("animationId") REFERENCES "Animation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayersTeams" (
    "teamId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    PRIMARY KEY ("teamId", "playerId"),
    CONSTRAINT "PlayersTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayersTeams_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "animationId" INTEGER NOT NULL,
    CONSTRAINT "Team_animationId_fkey" FOREIGN KEY ("animationId") REFERENCES "Animation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Animation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "description" TEXT,
    "adminUserId" INTEGER,
    "lanDayId" INTEGER,
    "startTime" TEXT,
    "weight" INTEGER NOT NULL,
    "isTeamed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Animation_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Animation_lanDayId_fkey" FOREIGN KEY ("lanDayId") REFERENCES "LanDay" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Animation" ("adminUserId", "description", "id", "lanDayId", "name", "shortName", "startTime", "weight") SELECT "adminUserId", "description", "id", "lanDayId", "name", "shortName", "startTime", "weight" FROM "Animation";
DROP TABLE "Animation";
ALTER TABLE "new_Animation" RENAME TO "Animation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
