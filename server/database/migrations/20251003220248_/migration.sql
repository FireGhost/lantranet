/*
  Warnings:

  - You are about to drop the column `nextStatusId` on the `OrderStatus` table. All the data in the column will be lost.
  - Added the required column `weight` to the `OrderStatus` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "weight" INTEGER NOT NULL
);
INSERT INTO "new_OrderStatus" ("color", "id", "name") SELECT "color", "id", "name" FROM "OrderStatus";
DROP TABLE "OrderStatus";
ALTER TABLE "new_OrderStatus" RENAME TO "OrderStatus";
CREATE UNIQUE INDEX "OrderStatus_weight_key" ON "OrderStatus"("weight");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
