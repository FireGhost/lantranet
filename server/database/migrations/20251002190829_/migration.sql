/*
  Warnings:

  - Added the required column `nameAtOrder` to the `OrdersItems` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "statusId" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "OrderStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "statusId", "userId") SELECT "createdAt", "id", "statusId", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_OrdersItems" (
    "itemId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "priceAtOrder" REAL NOT NULL,
    "nameAtOrder" TEXT NOT NULL,
    "comment" TEXT,

    PRIMARY KEY ("itemId", "orderId"),
    CONSTRAINT "OrdersItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdersItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrdersItems" ("comment", "itemId", "orderId", "priceAtOrder") SELECT "comment", "itemId", "orderId", "priceAtOrder" FROM "OrdersItems";
DROP TABLE "OrdersItems";
ALTER TABLE "new_OrdersItems" RENAME TO "OrdersItems";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
