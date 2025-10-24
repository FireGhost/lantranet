/*
  Warnings:

  - Added the required column `weight` to the `MenuCategory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL
);
INSERT INTO "new_MenuCategory" ("id", "name") SELECT "id", "name" FROM "MenuCategory";
DROP TABLE "MenuCategory";
ALTER TABLE "new_MenuCategory" RENAME TO "MenuCategory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
