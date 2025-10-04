-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "nextStatusId" INTEGER,
    CONSTRAINT "OrderStatus_nextStatusId_fkey" FOREIGN KEY ("nextStatusId") REFERENCES "OrderStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrderStatus" ("color", "id", "name") SELECT "color", "id", "name" FROM "OrderStatus";
DROP TABLE "OrderStatus";
ALTER TABLE "new_OrderStatus" RENAME TO "OrderStatus";
CREATE UNIQUE INDEX "OrderStatus_nextStatusId_key" ON "OrderStatus"("nextStatusId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
