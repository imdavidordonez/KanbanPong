/*
  Warnings:

  - Added the required column `ownerId` to the `UserStorie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - Add ownerId as an optional column */
ALTER TABLE "UserStorie" ADD COLUMN "ownerId" TEXT NOT NULL;


-- AddForeignKey
ALTER TABLE "UserStorie" ADD CONSTRAINT "UserStorie_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
