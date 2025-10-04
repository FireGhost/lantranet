/*
  Warnings:

  - You are about to drop the column `admin_user_id` on the `Animation` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Animation` table. All the data in the column will be lost.
  - You are about to drop the column `start_datetime` on the `Animation` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "LanDay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL
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
    CONSTRAINT "Animation_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Animation_lanDayId_fkey" FOREIGN KEY ("lanDayId") REFERENCES "LanDay" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Animation" ("description", "id", "name") SELECT "description", "id", "name" FROM "Animation";
DROP TABLE "Animation";
ALTER TABLE "new_Animation" RENAME TO "Animation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
