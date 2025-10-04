/*
  Warnings:

  - Added the required column `weight` to the `Animation` table without a default value. This is not possible if the table is not empty.

*/
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
    CONSTRAINT "Animation_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Animation_lanDayId_fkey" FOREIGN KEY ("lanDayId") REFERENCES "LanDay" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Animation" ("adminUserId", "description", "id", "lanDayId", "name", "shortName", "startTime") SELECT "adminUserId", "description", "id", "lanDayId", "name", "shortName", "startTime" FROM "Animation";
DROP TABLE "Animation";
ALTER TABLE "new_Animation" RENAME TO "Animation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
