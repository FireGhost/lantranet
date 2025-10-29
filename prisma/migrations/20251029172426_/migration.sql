/*
  Warnings:

  - The primary key for the `OrdersItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `OrdersItems` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrdersItems" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "priceAtOrder" REAL NOT NULL,
    "nameAtOrder" TEXT NOT NULL,
    "comment" TEXT,
    CONSTRAINT "OrdersItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdersItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrdersItems" ("comment", "itemId", "nameAtOrder", "orderId", "priceAtOrder") SELECT "comment", "itemId", "nameAtOrder", "orderId", "priceAtOrder" FROM "OrdersItems";
DROP TABLE "OrdersItems";
ALTER TABLE "new_OrdersItems" RENAME TO "OrdersItems";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
