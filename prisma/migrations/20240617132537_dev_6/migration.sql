/*
  Warnings:

  - You are about to drop the column `discription` on the `Video` table. All the data in the column will be lost.
  - Added the required column `description` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin_id" TEXT NOT NULL,
    CONSTRAINT "Video_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("admin_id", "createdAt", "id", "key", "name", "title", "type", "url") SELECT "admin_id", "createdAt", "id", "key", "name", "title", "type", "url" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");
PRAGMA foreign_key_check("Video");
PRAGMA foreign_keys=ON;
